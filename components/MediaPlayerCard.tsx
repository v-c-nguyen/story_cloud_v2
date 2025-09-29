import supabase from '@/app/lib/supabase';
import { useStoryStore } from '@/store/storyStore';
import { useTrackStore } from '@/store/trackStore';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useListenStore } from '@/store/listenStore';
import GradientSlider from './ui/GradientSlider';
import { Image } from "expo-image"
import * as FileSystem from 'expo-file-system';

import IconPlay from "@/assets/images/icons/play.svg";
import IconForward from "@/assets/images/icons/forward.svg";
import IconBackward from "@/assets/images/icons/backward.svg";
import IconPause from "@/assets/images/icons/pause.svg";
import IconExpand from "@/assets/images/icons/expand.svg";
import IconShrink from "@/assets/images/icons/shrink.svg";
import IconVolume from "@/assets/images/icons/volume.svg";

type MediaPlayerCardProps = {
    activeChild: any;
    onAudioEnd: () => void;
};

const iniWidth = Dimensions.get('window').width;
export default function MediaPlayerCard({ activeChild, onAudioEnd }: MediaPlayerCardProps) {
    // Flag to ignore first playback status update after seek
    const firstStatusUpdate = useRef(true);
    // Track state
    // Keep a ref to the current sound so cleanup can always access it (unmount etc.)
    const soundRef = useRef<Audio.Sound | null>(null);
    // Avoid storing the Audio.Sound in state to prevent re-renders when the native object changes
    const [isPlay, setIsPlay] = useState(false);
    const [volume, setVolume] = useState(1);
    const volumeRef = useRef<number>(1);
    const isMountedRef = useRef(true);
    // throttle updates from onPlaybackStatusUpdate to reduce renders
    const lastStatusUpdateRef = useRef<number>(0);
    const currentIndex = useListenStore(state => state.currentIndex)
    const track = useTrackStore(state => state.activeTrack);
    const setActiveTrack = useTrackStore(state => state.setActiveTrack)
    const setPlayed = useTrackStore(state => state.setPlayed)
    const setDuration = useTrackStore(state => state.setDuration)
    const story = useStoryStore((state) => state.listeningStory)
    const [isLoaded, setIsLoaded] = useState(false);
    const setCurrentStory = useStoryStore((state) => state.setCurrentStory);
    // Fullscreen state
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { width, height } = useWindowDimensions();
    const orientation: 'portrait' | 'landscape' = width > height ? 'landscape' : 'portrait';
    // Use orientation to conditionally apply styles
    // Example: const containerStyle = orientation === 'landscape' ? styles.landscapeContainer : styles.portraitContainer;

    // Remove unused audioUrl state

    // Fetch track info and set playback state

    useEffect(() => {
        async function fetchTrackData() {
            let trackData;

            trackData = {
                storyId: story?.storyId || '',
                childId: activeChild.id,
                played: story?.track?.played || 0,
                duration: story?.track?.duration || 1,
                watched: false,
                audioUrl: story?.audio_s_2_5
            }
            setActiveTrack(trackData);
            await loadAudio(trackData.audioUrl ?? '', trackData.played || 0);
        }
        if (story && !isLoaded)
            fetchTrackData()

    }, [story]);

    // Remove duplicate audio loading effect
    // Keep volume slider in sync with actual sound volume
    // keep native sound volume in sync but avoid causing re-renders
    useEffect(() => {
        volumeRef.current = volume;
        const s = soundRef.current;
        if (s) {
            s.setVolumeAsync(volume).catch(() => { /* ignore */ });
        }
    }, [volume]);
    // Helper: Save play progress to DB
    async function savePlayProgressToDB({ playedTime, totalTime, finished }: { playedTime: number, totalTime: number, finished?: boolean }) {

        if (!story?.storyId) return;
        try {
            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;

            // Use Supabase Edge Function invocation for consistency
            const payload = {
                storyId: story.storyId,
                childId: activeChild.id,
                playedTime,
                totalTime,
                finished: !!finished,
            };

            const { data, error } = await supabase.functions.invoke('track', {
                method: 'POST',
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
                body: payload,
            });

            if (error) {
                console.error('Error saving track via edge function', error);
                return;
            }

            if (data && data.data) {
                const d = data.data;
                const trackData = {
                    storyId: d.story_id || '',
                    childId: d.children_id,
                    played: d.played || 0,
                    duration: d.duration || 1,
                    watched: d.watched,
                    audioUrl: story?.audio_s_2_5,
                };
                const newStory = { ...story, track: d };
                setActiveTrack(trackData);
                setCurrentStory(newStory);
            }
        } catch (e) {
            console.error('Failed to save play progress', e);
        }
    }

    // Debounce wrapper to avoid too many network calls
    const saveDebounceRef = useRef<any>(null);
    function scheduleSave(playedTime: number, totalTime: number, finished?: boolean) {
        if (saveDebounceRef.current) {
            clearTimeout(saveDebounceRef.current);
        }
        saveDebounceRef.current = setTimeout(() => {
            savePlayProgressToDB({ playedTime, totalTime, finished });
            saveDebounceRef.current = null;
        }, 1500);
    }

    async function loadAudio(url: string, played: number = 0) {
        try {
            // Unload previous sound to avoid leaks and duplicate callbacks
            if (soundRef.current) {
                try {
                    // pause first to avoid playback continuing briefly
                    try { await soundRef.current.pauseAsync(); } catch {}
                    await soundRef.current.unloadAsync();
                } catch (e) {
                    console.warn('Failed to unload previous sound', e);
                }
                soundRef.current = null;
            }

            console.log("loadAudio - requested URL:", url);

            // Try a HEAD request to check availability and log status
            let headStatus: number | null = null;
            try {
                const headRes = await fetch(url, { method: 'HEAD' });
                headStatus = headRes.status;
                console.log('Audio HEAD status:', headStatus);
            } catch (e) {
                console.warn('Audio HEAD request failed:', e);
                headStatus = null;
            }

            // If HEAD returned 200, try streaming the remote URL directly.
            // Otherwise, fallback to downloading the file to cache and play locally.
            let playUri = url;
            const tryUseRemote = headStatus === 200 || headStatus === 0 || headStatus === null;
            if (!tryUseRemote) {
                // download-to-cache fallback
                console.log('Falling back to download-to-cache for audio URL');
                const fileName = url.split('/').pop()?.split('?')[0] || `audio-${Date.now()}.mp3`;
                const cacheDir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory || '';
                const localUri = `${cacheDir}${fileName}`;
                try {
                    const info = await FileSystem.getInfoAsync(localUri);
                    if (!info.exists) {
                        // Try download without auth first
                        try {
                            const dl = await FileSystem.downloadAsync(url, localUri);
                            console.log('Downloaded audio to', dl.uri, 'status:', dl.status);
                        } catch (err) {
                            console.warn('Download without auth failed, will retry with auth if available', err);
                            // try with Authorization header if we have a jwt
                            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
                            if (jwt) {
                                try {
                                    const dl = await FileSystem.downloadAsync(url, localUri, { headers: { Authorization: `Bearer ${jwt}` } } as any);
                                    console.log('Downloaded audio with auth to', dl.uri, 'status:', dl.status);
                                } catch (err2) {
                                    console.error('Download with auth also failed', err2);
                                    throw err2;
                                }
                            } else {
                                throw err;
                            }
                        }
                    } else {
                        console.log('Using cached audio at', localUri);
                    }
                    playUri = localUri;
                } catch (downloadErr) {
                    console.error('Failed to download audio fallback, will attempt remote play anyway', downloadErr);
                    playUri = url; // last resort
                }
            }

            // create and store native Audio.Sound on a ref (do not set to state)
            console.log('Creating audio from uri:', playUri);
            const { sound: playbackObject, status } = await Audio.Sound.createAsync(
                { uri: playUri },
                { shouldPlay: false },
                onPlaybackStatusUpdate
            );
            // Only assign to ref to avoid extra renders
            soundRef.current = playbackObject;
            if (status.isLoaded) {
                console.log("loaded!!")
                if (isMountedRef.current) setIsLoaded(true);
                // Only update duration in store when it changes noticeably to avoid frequent updates
                const newDuration = status.durationMillis ? status.durationMillis / 1000 : 1;
                // Compare against current store value and update if changed significantly
                const prevDur = track?.duration ?? 0;
                if (!prevDur || Math.abs(prevDur - newDuration) > 0.5) {
                    setDuration(newDuration);
                }
                if (typeof status.volume === 'number') {
                    volumeRef.current = status.volume;
                    if (isMountedRef.current) setVolume(status.volume);
                }
                // Seek to played position if available
                if (played > 0) {
                    await playbackObject.setPositionAsync(played * 1000);
                    setPlayed(played);
                    firstStatusUpdate.current = true; // Reset flag for next load
                }
            }
        } catch (e) {
            console.error('Failed to load audio', e);
        }
    }

    // Unload sound and cancel pending saves on unmount
    useEffect(() => {
        return () => {
            // clear debounce
            try {
                if (saveDebounceRef.current) {
                    clearTimeout(saveDebounceRef.current);
                    saveDebounceRef.current = null;
                }
            } catch (e) {
                // ignore
            }

            (async () => {
                try {
                    if (soundRef.current) {
                        try { await soundRef.current.pauseAsync(); } catch (e) {}
                        try { await soundRef.current.unloadAsync(); } catch (e) { console.warn('Error unloading sound on unmount', e); }
                        soundRef.current = null;
                    }
                } catch (e) {
                    console.warn('Error during audio cleanup on unmount', e);
                }
            })();
            isMountedRef.current = false;
        };
    }, []);

    function onPlaybackStatusUpdate(status: any) {
        if (!status || !status.isLoaded) return;

        const now = Date.now();
        // Always handle finished immediately
        if (status.didJustFinish && !status.isPlaying) {
            savePlayProgressToDB({ playedTime: status.durationMillis ? status.durationMillis / 1000 : 1, totalTime: status.durationMillis ? status.durationMillis / 1000 : 1, finished: true });
            if (onAudioEnd) onAudioEnd();
            // Update play state
            if (isMountedRef.current) setIsPlay(false);
            return;
        }

        // Throttle frequent updates to at most once per 300ms
        const last = lastStatusUpdateRef.current || 0;
        if (now - last < 300) return;
        lastStatusUpdateRef.current = now;

        // Ignore the first status update after seek
        if (firstStatusUpdate.current) {
            firstStatusUpdate.current = false;
        }

        // Update UI/state in a rate-limited way
        const playedSecs = status.positionMillis / 1000;
        const durationSecs = status.durationMillis ? status.durationMillis / 1000 : 1;
            if (isMountedRef.current) {
                setPlayed(playedSecs);
                // Only update duration if it changed significantly compared to store
                const prevD = track?.duration ?? 0;
                if (!prevD || Math.abs(prevD - durationSecs) > 0.5) setDuration(durationSecs);
                setIsPlay(!!status.isPlaying);
            }

        // If paused (not finished), schedule a debounced save
        if (!status.isPlaying && !status.didJustFinish && status.positionMillis > 0) {
            scheduleSave(playedSecs, durationSecs, false);
        }
    }

    const handlePlayPause = useCallback(async () => {
        const s = soundRef.current;
        if (!s) return;
        try {
            if (isPlay) {
                await s.pauseAsync();
                if (isMountedRef.current) setIsPlay(false);
            } else {
                await s.playAsync();
                if (isMountedRef.current) setIsPlay(true);
            }
        } catch (e) {
            console.warn('Play/pause failed', e);
        }
    }, [isPlay]);

    const handleSeek = useCallback(async (seconds: number) => {
        const s = soundRef.current;
        if (!s) return;
        let newTime = (track?.played ?? 0) + seconds;
        if (newTime < 0) newTime = 0;
        if (newTime > (track?.duration ?? 0)) newTime = (track?.duration ?? 0);
        try {
            await s.setPositionAsync(newTime * 1000);
            setPlayed(newTime);
        } catch (e) {
            console.warn('Seek failed', e);
        }
    }, [track?.played, track?.duration]);

    const handleSeekForward = useCallback(() => handleSeek(10), [handleSeek]);
    const handleSeekBackward = useCallback(() => handleSeek(-10), [handleSeek]);


    // Volume control
    // update native volume immediately but update UI state throttled
    const volumeUpdateTimeout = useRef<any>(null);
    const handleVolumeChange = useCallback((value: number) => {
        volumeRef.current = value;
        const s = soundRef.current;
        if (s) s.setVolumeAsync(value).catch(() => {});
        // throttle UI updates
        if (volumeUpdateTimeout.current) clearTimeout(volumeUpdateTimeout.current);
        volumeUpdateTimeout.current = setTimeout(() => {
            if (isMountedRef.current) setVolume(value);
            volumeUpdateTimeout.current = null;
        }, 200);
    }, []);

    // Format seconds to mm:ss
    const formatTime = useCallback((s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? "0" : ""}${sec}`;
    }, []);

    return (
        <>
            {/* Fullscreen Modal for landscape */}
            {isFullscreen && orientation === 'landscape' &&
                <ThemedView>
                    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Overlay player UI matching attached design */}
                        <Image
                            source={story?.featuredIllustration ? story.featuredIllustration : require("@/assets/images/parent/sample-card-image.png")}
                            style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.7 }}
                        />
                        <View style={{ position: 'absolute', top: 40, left: 0, right: 0, alignItems: 'center' }}>
                            <Text style={{ color: '#FFE7A0', fontWeight: 'bold', fontSize: 18 }}>{story?.series}</Text>
                            <Text style={{ color: 'white', fontSize: 16, marginTop: 4 }}>
                                #{currentIndex + 1} {story?.storyTitle}
                            </Text>
                        </View>
                        {/* Controls row */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 120 }}>
                            <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => handleSeek(-10)}>
                                <IconBackward width={60} height={60} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={handlePlayPause}>
                                {isPlay ? <IconPause width={85} height={85} /> : <IconPlay width={85} height={85} />}
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => handleSeek(10)}>
                                <IconForward width={60} height={60} />
                            </TouchableOpacity>
                        </View>
                        {/* Bottom bar */}
                        <View style={{ position: 'absolute', bottom: 30, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <GradientSlider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={track?.duration ?? 0}
                                value={track?.played ?? 0}
                                onSlidingComplete={async (value: number) => {
                                    const s = soundRef.current;
                                    if (s) await s.setPositionAsync(value * 1000);
                                }}
                            />
                            <Text style={{ color: '#FFE7A0', fontSize: 16, marginLeft: 10 }}>{formatTime((track?.played ?? 0))} / {formatTime((track?.duration ?? 0))}</Text>
                            <TouchableOpacity style={{ marginLeft: 10 }}>
                                <Image source={require("@/assets/images/icons/volume.png")} style={{ width: 28, height: 28, tintColor: "#FFE7A0" }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 10 }}>
                                <Image source={require("@/assets/images/icons/expand.png")} style={{ width: 26, height: 26, tintColor: "#FFE7A0" }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ThemedView>}

            {/* Fullscreen Modal */}
            <Modal visible={isFullscreen && isPlay} animationType="fade" transparent={true}>
                <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                        activeOpacity={0.8}
                        onPress={async () => {
                            const s = soundRef.current;
                            if (s && isPlay) {
                                await s.pauseAsync();
                                setIsPlay(false);
                            }
                        }}
                    >
                        <Image
                            source={story?.featuredIllustration ? story.featuredIllustration : require("@/assets/images/parent/sample-card-image.png")}
                            style={{ width: '100%', aspectRatio: 16 / 9, resizeMode: 'stretch', borderColor: 'rgba(250, 248, 248, 0.2)' }}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>

            <View style={[styles.container]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerAdventure}>{story?.series}</Text>
                    <Text style={styles.headerTitle}>
                        <Text style={styles.headerNumber}>#{currentIndex + 1} </Text>
                        <Text style={styles.headerTitleItalic}>{story?.storyTitle}</Text>
                    </Text>
                </View>
                {/* Image */}
                <ThemedView style={{ paddingHorizontal: isFullscreen ? 0 : 12 }}>
                    <Image
                        source={story?.featuredIllustration ? story.featuredIllustration : require("@/assets/images/parent/sample-card-image.png")}
                        style={[styles.cardImage, isFullscreen && { width: '100%', borderRadius: 0, borderWidth: 0 }]}
                        contentFit="cover"
                    />
                </ThemedView>
                <ThemedView style={[styles.pauseStyle, (isPlay || isFullscreen) && { display: 'none' }]}>
                    <TouchableOpacity style={styles.continueBtn} onPress={handlePlayPause}>
                        <Image source={require('@/assets/images/icons/icon-play.png')} style={{ width: 30, height: 30 }} />
                        <ThemedText style={styles.btnText} >Continue</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {/* Player Bar */}
                <View style={styles.playerBar}>

                    <View style={styles.playerSubBar}>
                        <GradientSlider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={track?.duration ?? 0}
                            value={track?.played ?? 0}
                            onSlidingComplete={async (value: number) => {
                                const s = soundRef.current;
                                if (s) await s.setPositionAsync(value * 1000);
                            }}
                        />
                        <Text style={styles.timeText}>{formatTime((track?.played ?? 0))} / {formatTime((track?.duration ?? 0))}</Text>
                        <View style={styles.volumeBarContainer}>
                            <IconVolume style={styles.volumeIcon} />
                            <GradientSlider
                                style={styles.volumeSlider}
                                minimumValue={0}
                                maximumValue={1}
                                value={volume}
                                onValueChange={handleVolumeChange}
                            />
                        </View>
                        <TouchableOpacity onPress={() => setIsFullscreen(!isFullscreen)}>
                            {
                                isFullscreen ? <IconShrink width={26} height={26} /> : <IconExpand width={26} height={26} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Controls */}
                <View style={[styles.controlsRow, isFullscreen && styles.controlsRow_FS]}>
                    <TouchableOpacity style={styles.sideButton} onPress={() => handleSeek(-10)}>
                        <IconBackward width={85} height={85} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                        {
                            isPlay ? <IconPause width={85} height={85} /> : <IconPlay width={85} height={85} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sideButton} onPress={() => handleSeek(10)}>
                        <IconForward width={85} height={85} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 20,
        paddingBottom: 22,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
    },
    header: {
        alignItems: "center",
        marginBottom: 2,
    },
    headerAdventure: {
        color: "#FFE7A0",
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: 0.5,
        marginBottom: 5,
    },
    headerTitle: {
        height: 40,
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    headerNumber: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    headerTitleItalic: {
        fontStyle: "italic",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    cardImage: {
        width: "100%",
        height: iniWidth / 2 * 1.4,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'rgba(250, 248, 248, 0.2)',
        marginBottom: 12,
    },
    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        justifyContent: "center",
        gap: 25,
        marginBottom: 12,
        marginTop: 6,
    },
    controlsRow_FS: {
        width: '100%',
        height: iniWidth / 2 * 1.4,
        position: 'absolute',
        backgroundColor: 'rgba(rgba(5, 59, 74, 0.5))',
        top: '0%',
        left: '0%',
        transform: 'translate(0, 100px)',
    },
    pauseStyle: {
        width: '100%',
        height: iniWidth / 2 * 1.4,
        backgroundColor: 'rgba(rgba(5, 59, 74, 0.5))',
        justifyContent: 'center',
        alignItems: 'center',
        top: 110,
        borderRadius: 20,
        position: 'absolute'
    },
    continueBtn: {
        width: 200,
        backgroundColor: 'rgba(244, 166, 114, 1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 70,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        fontSize: 18,
        fontWeight: 400,
        color: 'rgba(5, 59, 74, 1)'
    },
    playButton: {
        width: 85,
        height: 85,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 22,
        shadowColor: "#000",
        shadowOpacity: 0.13,
        shadowRadius: 6,
    },
    playIcon: {
        width: 85,
        height: 85,
    },
    sideButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.11,
        shadowRadius: 4,
    },
    sideIcon: {
        width: 85,
        height: 85,
    },
    playerBar: {
        width: "92%",
        alignSelf: "center",
        marginTop: 8,
        marginBottom: 20
    },
    slider: {
        width: '30%',
        height: 20,
        marginTop: 0,
    },
    playerSubBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 2,
    },
    timeText: {
        color: "#FFE7A0",
        fontSize: 16,
        fontWeight: "600",
    },
    volumeIcon: {
        width: 28,
        height: 28,
        tintColor: "#FFE7A0",
        marginRight: 0,
    },
    volumeBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 110,
        marginHorizontal: 8,
    },
    volumeSlider: {
        flex: 1,
        height: 20,
    },
    expandIcon: {
        width: 26,
        height: 26,
        tintColor: "#FFE7A0",
    },
});