import supabase from "@/app/lib/supabase";
import BottomNavBar from "@/components/BottomNavBar";
import { StoryCard2 } from "@/components/Cards";
import CardSeries from "@/components/CardSeries";
import MapWrapper from "@/components/MapWrapper";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { stories } from "@/data/storyData";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import { Image } from "expo-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import IconSearch from "@/assets/images/icons/icon-search.svg"
import IconMic from "@/assets/images/icons/icon-micro.svg"
import Header from "@/components/Header";
import { useUser } from "@/app/lib/UserContext";
import { useCharactersStore } from "@/store/charactersStore";
import { useLocationsStore } from "@/store/locationsStore";
import { ItemSeries, ItemSeriesRef } from "@/components/ItemSeries";
import normalize from "@/app/lib/normalize";
import MapListWithBadge from "@/components/kid/explore/MapListWithBadge";

import MapBack from "@/assets/images/kid/map_back.svg";
import IconSeries from "@/assets/images/parent/series.svg"
import IconCollections from "@/assets/images/parent/collections.svg"
import IconMap from "@/assets/images/parent/map.svg"
import IconThemes from "@/assets/images/parent/themes.svg"
import IconCharacters from "@/assets/images/parent/characters.svg"
import useIsMobile from "@/hooks/useIsMobile";

const cardsData = [
    { color: '#FFFFFF', icon: IconSeries, text: 'Series' },
    { color: '#F8ECAE', icon: IconCollections, text: 'Collections' },
    { color: '#ADD7DA', icon: IconMap, text: 'Map' },
    { color: '#7AC1C6', icon: IconThemes, text: 'Themes' },
    { color: '#053B4A', icon: IconCharacters, text: 'Characters' },
];

export default function Map() {
    const { child } = useUser();
    const isMobile = useIsMobile();
    const [characterLoading, setCharacterLoading] = React.useState(false);
    const [landmarkLoading, setlandmarkLoading] = React.useState(false);
    const characters = useCharactersStore((s) => s.characters);
    const setCharacters = useCharactersStore((s) => s.setCharacters);
    const locations = useLocationsStore((s) => s.locations);
    const setLocations = useLocationsStore((s) => s.setLocations);
    const [categories, setCategory] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState('Storyland Map');
    const [activeTab, setActiveTab] = React.useState('characters');
    const [dropdownVisible, setDropdownVisible] = React.useState(false);
    const currentCharacter = useCharactersStore((s) => s.currentKidCharacter);
    const setCurrentCharacter = useCharactersStore((s) => s.setCurrentKidCharacter);
    const currentLocation = useLocationsStore((s) => s.currentKidLocation);
    const setCurrentLocation = useLocationsStore((s) => s.setCurrentKidLocation);
    const [searchQuery, setSearchQuery] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const itemSeriesRef = useRef<ItemSeriesRef>(null);

    const filteredCollections = categories.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        setLoading(true);
        async function fetchCharacters() {
            try {
                const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
                const { data, error } = await supabase.functions.invoke('stories/characters', {
                    method: 'GET',
                    headers: {
                        Authorization: jwt ? `Bearer ${jwt}` : '',
                    },
                });
                if (error) {
                    console.error('Error fetching map regions:', error.message);

                } else if (data && Array.isArray(data)) {
                    setCharacters(data);
                    setCategory(data)
                }
            } catch (e) {
                console.error('Error fetching map regions:', e);
            } finally {
                setLoading(false);
            }
        }

        async function fetchLocations() {
            try {
                const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
                const { data, error } = await supabase.functions.invoke('stories/locations', {
                    method: 'GET',
                    headers: {
                        Authorization: jwt ? `Bearer ${jwt}` : '',
                    },
                });
                if (error) {
                    console.error('Error fetching locations:', error.message);

                } else if (data && Array.isArray(data)) {
                    setLocations(data);
                }
            } catch (e) {
                console.error('Error fetching locations:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchCharacters();
        fetchLocations();
    }, []);

    useEffect(() => {
        console.log(activeTab)
        if (activeTab) {
            setCategory(activeTab == "characters" ? characters : locations);
        }
    }, [activeTab])

    function handleCharacterSelected(item: string) {
        console.log("characters:", item)
        if (!setCurrentCharacter) return;
        // Find matching character object
        const found = categories.find(
            (c: any) => (c.name || String(c)).trim() === item.trim()
        );
        console.log("found:", found, currentCharacter)
        if (
            currentCharacter &&
            normalize((currentCharacter as any).name) === normalize(item)
        ) {
            setCurrentCharacter(null);
        } else if (found) {
            setCurrentCharacter(found as any);
        } else {
            setCurrentCharacter(null);
        }
    }

    function handleLocationSelected(item: string) {
        if (!setCurrentLocation) return;
        const found = categories.find((t: any) => t.name === item || t.id === item);
        if (
            currentLocation &&
            ((currentLocation as any).name === item || (currentLocation as any).id === item)
        ) {
            setCurrentLocation(null);
        } else if (found) {
            setCurrentLocation(found as any);
        } else {
            setCurrentLocation(null);
        }
    }

    function handleSelectedItem(item: string) {
        console.log(item)
        if (activeTab == "characters")
            handleCharacterSelected(item);
        else
            handleLocationSelected(item);
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.rootContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require("@/assets/images/auth/back-pattern.png")}
                        style={styles.topBackPattern}
                        contentFit="cover"
                    />
                    <Header role="kid" mode={child?.mode} />

                    {/* Header */}
                    <ThemedText style={styles.headerTitle}>StoryCloud Map</ThemedText>

                    <ThemedView style={styles.headerCloudWrap}>
                        {/* Clouds */}
                        {isMobile &&
                            <Image
                                source={require("@/assets/images/kid/cloud-group-far.png")}
                                style={styles.imgCloudFar}
                                contentFit="cover"
                            />
                        }
                        {isMobile &&
                            <Image
                                source={require("@/assets/images/kid/cloud-group-near.png")}
                                style={styles.imgCloudNear}
                                contentFit="cover"
                            />
                        }
                        {
                            !isMobile &&
                            <Image
                                source={require("@/assets/images/kid/cloud-group.png")}
                                style={styles.imgCloudTablet}
                                contentFit="fill"
                            />
                        }
                        {/* Header */}
                        <ThemedView style={{ paddingTop: 25, marginTop: 30, paddingHorizontal: 16, width: '100%' }}>
                            <ThemedView
                                style={styles.searchBoxStyle}
                            >
                                <IconSearch color={"#053b4a7c"} width={26} height={26} />
                                <TextInput
                                    placeholder="Search for your next adventure..."
                                    placeholderTextColor={'#053b4a7e'}
                                    style={styles.searchText}
                                />
                                <IconMic width={28} height={28} />
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                    {/* Tab Bar */}

                    <ThemedView style={styles.mainContent}>
                        <ThemedView style={styles.content}>
                            {/* Story List */}
                            <ThemedView style={{ marginBottom: 80 }}>
                                <CardSeries data={cardsData} active="Map" />
                            </ThemedView>
                            {
                                !(currentCharacter || currentLocation) &&
                                <ThemedView style={{ position: "relative" }}>
                                    <MapBack width={600} height={1400} style={styles.mapback} />

                                    <ThemedView style={styles.bottomPadding}>
                                        <ThemedView style={{ marginBottom: 80 }}>
                                            <MapWrapper
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                characterLoading={characterLoading}
                                                landmarkLoading={landmarkLoading}
                                                mode="kid"
                                            />
                                        </ThemedView>
                                    </ThemedView>
                                    <ThemedView style={{ position: "relative" }}>
                                        <Image
                                            source={require("@/assets/images/kid/cloud-group-far.png")}
                                            style={styles.imgCloudFar2}
                                            contentFit="cover"
                                        />
                                        <Image
                                            source={require("@/assets/images/kid/cloud-group-near.png")}
                                            style={styles.imgCloudNear2}
                                            contentFit="cover"
                                        />
                                    </ThemedView>
                                </ThemedView>

                            }

                            <ThemedView>
                                <ThemedView style={{ marginTop: -60, backgroundColor: "#fff" }}>
                                    <ItemSeries
                                        ref={itemSeriesRef}
                                        itemsData={filteredCollections}
                                        onSelect={(item) => {
                                            handleSelectedItem(item?.name || "");
                                        }}
                                    />
                                    {/* Story List */}
                                    <MapListWithBadge
                                        charactersCategories={categories}
                                        mode="parent"
                                    />
                                </ThemedView>
                            </ThemedView>
                            <ThemedView>
                            </ThemedView>

                        </ThemedView>
                    </ThemedView>

                </ScrollView>
                {/* Sticky Bottom Navigation */}
                <ThemedView
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 178,
                        zIndex: 1000,
                    }}
                >
                    <BottomNavBar active="Explore" theme="light" image={true} />
                </ThemedView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );


    function SectionHeader({ title, desc, link, onPress }: { title: string; desc: string, link: string, onPress: any }) {
        return (
            <TouchableOpacity onPress={onPress}>
                {/* <Image source={require('@/assets/images/avatars/dog.png')} style={styles.avatar} /> */}
                <ThemedText style={styles.title}>{title}</ThemedText>
                <ThemedView style={styles.sectionContainer}>

                    <ThemedView>

                        <ThemedText style={styles.description}>{desc}</ThemedText>
                    </ThemedView>
                </ThemedView>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 16,
        width: 289,
        height: 116,
        gap: 10,
    },
    mapback: {
        position: "absolute",
        top: -110,
        left: -100
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        marginBottom: 50,
        marginTop: 50,
    },
    bottomPadding: {
        paddingBottom: 80
    },
    title: {
        fontFamily: 'Sitara',
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 32.4,
        color: '#053B4A',
    },
    description: {
        fontFamily: 'Sitara',
        fontWeight: '400',
        fontStyle: 'italic',
        fontSize: 16,
        lineHeight: 21.6,
        color: '#053B4A',
    },
    rootContainer: {
        flex: 1,
        backgroundColor: "#F8ECAE",
        position: "relative",
    },
    cloudImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    topBackPattern: {
        width: "100%",
        height: 400,
        maxHeight: 1200,
        position: "absolute",
    },
    headingWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 16,
        marginRight: 16,
        marginTop: 23,
    },
    logoBallon: { width: 48, height: 48 },
    headerTitle: {
        color: "#053B4A",
        fontSize: 28,
        fontWeight: "700",
        lineHeight: 33.6,
        textAlign: "center",
        marginTop: 67,
        marginBottom: 66,
    },
    backWrap: {
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 84,
        height: 40,
        marginBottom: 58,
    },
    imgArrowLeft: {
        width: 40,
        height: 40,
    },
    backText: {
        color: "#F4A672",
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 40,
        height: 40,

    },
    headerCloudWrap: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -90,
        position: "relative",
    },
    imgCloudFar: {
        width: "100%",
        height: 278,
        position: "absolute",
        top: 0,
        left: 0,
    },
    imgCloudNear: {
        width: "100%",
        height: 279,
        position: "absolute",
        top: 42,
        left: 0,
    },
    imgCloudNear2: {
        width: "100%",
        height: 279,
        position: "absolute",
        top: -210,
        left: 0,
    },
    imgCloudFar2: {
        width: "100%",
        height: 278,
        position: "absolute",
        top: -250,
        left: 0,
    },
    imgCloudTablet: {
        width: '105%',
        height: '180%',
        position: "absolute",
        top: 50,
        left: 0,
        zIndex: -100,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        alignItems: 'center',
        gap: 20,
    },
    cardWrap: {
        marginBottom: 16,
        alignItems: "center",
    },
    searchBoxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
        width: "100%",
        fontSize: 14,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: '#fff',
        gap: 10
    },
    searchText: {
        width: '100%',
        outlineWidth: 0,
        fontSize: 14,
        paddingVertical: 10
    },
    searchIcon: {

    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    tabItem: {
        alignItems: 'center',
    },
    mainContent: {
        height: '100%',
        backgroundColor: '#ffffff'
    },
    content: {
        marginTop: 0
    },
    cardScrollContainer: {
        gap: 20,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        marginTop: 0,
        marginBottom: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        color: "#053B4A",
        fontSize: 24,
        marginTop: 60,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontWeight: "700",
        lineHeight: 24,
    },
    sectiondesc: {
        color: "#053B4A",
        fontSize: 16,
        fontWeight: "400",
        fontStyle: 'italic',
        lineHeight: 24,
    },
    collectionHeader: {
        alignItems: 'center',
        paddingVertical: 20,

    },
    collectionImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    collectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#38A3A5',
        marginBottom: 10,
        fontFamily: "Sitara"
    },
    collectionDescription: {
        fontSize: 16,
        color: '#38A3A5',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        fontFamily: "Sitara"
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#38A3A5',
    },
});