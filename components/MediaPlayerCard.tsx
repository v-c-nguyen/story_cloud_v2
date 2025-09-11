import supabase from '@/app/lib/supabase';
import { useStoryStore } from '@/store/storyStore';
import { useTrackStore } from '@/store/trackStore';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useListenStore } from '@/store/listenStore';
import GradientSlider from './ui/GradientSlider';

import IconPlay from "@/assets/images/icons/play.svg";
import IconForward from "@/assets/images/icons/forward.svg";
import IconBackward from "@/assets/images/icons/backward.svg";
import IconPause from "@/assets/images/icons/pause.svg";
import IconExpand from "@/assets/images/icons/expand.svg";
import IconShrink from "@/assets/images/icons/shrink.svg";
import IconVolume from "@/assets/images/icons/volume.svg";
import IconMusic from "@/assets/images/icons/music.svg";
// ...existing code...

type MediaPlayerCardProps = {
    activeChild: any;
    onAudioEnd: () => void;
};

export default function MediaPlayerCard({ activeChild, onAudioEnd }: MediaPlayerCardProps) {
    // Flag to ignore first playback status update after seek
    const firstStatusUpdate = useRef(true);
    // Track state
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlay, setIsPlay] = useState(false);
    const [volume, setVolume] = useState(1);
    const currentIndex = useListenStore(state => state.currentIndex)
    const track = useTrackStore(state => state.activeTrack);
    const setActiveTrack = useTrackStore(state => state.setActiveTrack)
    const setPlayed = useTrackStore(state => state.setPlayed)
    const setDuration = useTrackStore(state => state.setDuration)
    const setWatched = useTrackStore(state => state.setWatched)
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
    useEffect(() => {
        if (sound) {
            sound.setVolumeAsync(volume);
        }
    }, [volume, sound]);
    // Helper: Save play progress to DB
    async function savePlayProgressToDB({ playedTime, totalTime, finished }: { playedTime: number, totalTime: number, finished?: boolean }) {

        if (!story?.storyId) return;
        try {
            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;

            // Save play progress to track table
            const fetchResponse = await fetch('https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
                body: JSON.stringify({
                    storyId: story.storyId,
                    childId: activeChild.id,
                    playedTime,
                    totalTime,
                    finished: !!finished,
                })
            });
            const data = await fetchResponse.json();
            if (fetchResponse.ok && data) {
                let trackData, newStory;

                trackData = {
                    storyId: data.data?.story_id || '',
                    childId: data.data?.children_id,
                    played: data.data?.played || 0,
                    duration: data.data?.duration || 1,
                    watched: data.data?.watched,
                    audioUrl: story?.audio_s_2_5
                }
                newStory = {
                    ...story,
                    ...{ track: data.data }
                }
                setActiveTrack(trackData);
                setCurrentStory(newStory)

                // Add to Zustand store
                // Redirect on success
            } else {
                alert(data?.error || 'Failed to save track');
            }
            // If finished, set watched=true in DB
            if (finished) {
                await fetch('https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: jwt ? `Bearer ${jwt}` : '',
                    },
                    body: JSON.stringify({ watched: true })
                });
            }
        } catch (e) {
            console.error('Failed to save play progress', e);
        }
    }

    async function loadAudio(url: string, played: number = 0) {
        try {
            console.log("loadAudio")
            const { sound: playbackObject, status } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: false },
                onPlaybackStatusUpdate
            );
            setSound(playbackObject);
            if (status.isLoaded) {
                console.log("loaded!!")
                setIsLoaded(true);
                setDuration(status.durationMillis ? status.durationMillis / 1000 : 1);
                if (typeof status.volume === 'number') setVolume(status.volume);
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

    function onPlaybackStatusUpdate(status: any) {
        if (status.isLoaded) {
            // Ignore the first status update after seek
            setPlayed(status.positionMillis / 1000);
            setDuration(status.durationMillis ? status.durationMillis / 1000 : 1);
            setIsPlay(status.isPlaying);
            // Track progress when paused
            if (!status.isPlaying && !status.didJustFinish && status.positionMillis > 0) {

                savePlayProgressToDB({ playedTime: status.positionMillis / 1000, totalTime: status.durationMillis ? status.durationMillis / 1000 : 1 });
            }
            // Detect when audio finishes
            if (status.didJustFinish && !status.isPlaying) {
                console.log("Finished!!!", status.didJustFinish, status.isPlaying)
                savePlayProgressToDB({ playedTime: status.durationMillis ? status.durationMillis / 1000 : 1, totalTime: status.durationMillis ? status.durationMillis / 1000 : 1, finished: true });
                if (onAudioEnd) {
                    onAudioEnd();
                }
            }
        }
    }

    const handlePlayPause = async () => {
        if (!sound) return;
        if (isPlay) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
    };

    const handleSeek = async (seconds: number) => {
        if (!sound) return;
        let newTime = (track?.played ?? 0) + seconds;
        if (newTime < 0) newTime = 0;
        if (newTime > (track?.duration ?? 0)) newTime = (track?.duration ?? 0);
        await sound.setPositionAsync(newTime * 1000);
    };


    // Volume control
    const handleVolumeChange = (value: number) => {
        setVolume(value);
    };

    // Format seconds to mm:ss
    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <>
            {/* Fullscreen Modal for landscape */}
            <Modal visible={isFullscreen && orientation === 'landscape'} animationType="fade" transparent={true}>
                <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Overlay player UI matching attached design */}
                    <Image
                        source={require("@/assets/images/parent/sample-card-image.png")}
                        style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.7 }}
                    />
                    <View style={{ position: 'absolute', top: 40, left: 0, right: 0, alignItems: 'center' }}>
                        <Text style={{ color: '#FFE7A0', fontWeight: 'bold', fontSize: 18 }}>{story?.seriesCategory}</Text>
                        <Text style={{ color: 'white', fontSize: 16, marginTop: 4 }}>
                            #{currentIndex + 1} {story?.storyTitle}
                        </Text>
                    </View>
                    {/* Controls row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 120 }}>
                        <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => handleSeek(-10)}>
                            <IconBackward width={60} height={60}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={handlePlayPause}>
                            {isPlay ? <IconPause width={85} height={85}/> : <IconPlay width={85} height={85}/>}
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={() => handleSeek(10)}>
                            <IconForward width={60} height={60}/>
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
                                if (sound) await sound.setPositionAsync(value * 1000);
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
            </Modal>
            
            {/* Fullscreen Modal */}
            <Modal visible={isFullscreen && isPlay} animationType="fade" transparent={true}>
                <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                        activeOpacity={0.8}
                        onPress={async () => {
                            if (sound && isPlay) {
                                await sound.pauseAsync();
                                setIsPlay(false);
                            }
                        }}
                    >
                        <Image
                            source={require("@/assets/images/parent/sample-card-image.png")}
                            style={{ width: '100%', aspectRatio: 16 / 9, resizeMode: 'stretch', borderColor: 'rgba(250, 248, 248, 0.2)' }}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>

            <View style={[styles.container, orientation == 'landscape' && { display: 'none' }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerAdventure}>{story?.seriesCategory}</Text>
                    <Text style={styles.headerTitle}>
                        <Text style={styles.headerNumber}>#{currentIndex + 1} </Text>
                        <Text style={styles.headerTitleItalic}>{story?.storyTitle}</Text>
                    </Text>
                </View>
                {/* Image */}
                <Image
                    source={require("@/assets/images/parent/sample-card-image.png")} // Replace with your image
                    style={[styles.cardImage, isFullscreen && { width: '100%', borderRadius: 0, borderWidth: 0 }]}
                    resizeMode="cover"
                />
                <ThemedView style={[styles.pauseStyle, (isPlay || isFullscreen) && { display: 'none' }]}>
                    <TouchableOpacity style={styles.continueBtn} onPress={handlePlayPause}>
                        <Image source={require('@/assets/images/icons/icon-play.png')} />
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
                                if (sound) await sound.setPositionAsync(value * 1000);
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
                            isPlay ? <IconPause width={85} height={85}/> : <IconPlay width={85} height={85}/>
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
        height: 195,
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
        height: 200,
        position: 'absolute',
        backgroundColor: 'rgba(rgba(5, 59, 74, 0.5))',
        top: '0%',
        left: '0%',
        transform: 'translate(0, 100px)',
    },
    pauseStyle: {
        width: '100%',
        height: 200,
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