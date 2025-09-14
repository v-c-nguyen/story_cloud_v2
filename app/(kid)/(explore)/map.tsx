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
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import IconSearch from "@/assets/images/icons/icon-search.svg"
import IconMic from "@/assets/images/icons/icon-micro.svg"
import Header from "@/components/Header";
import { useUser } from "@/app/lib/UserContext";


const cardsData = [
    { color: '#FFFFFF', icon: require('@/assets/images/parent/series.png'), text: 'Series' },
    { color: '#F8ECAE', icon: require('@/assets/images/parent/collections.png'), text: 'Collections' },
    { color: '#ADD7DA', icon: require('@/assets/images/parent/map.png'), text: 'Map' },
    { color: '#7AC1C6', icon: require('@/assets/images/parent/themes.png'), text: 'Themes' },
    { color: '#053B4A', icon: require('@/assets/images/parent/characters.png'), text: 'Characters' },
];

export default function Map() {
    const {child} = useUser();
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<any | null>(null);
    const storiesData = stories
    const scrollViewRef = useRef<ScrollView>(null);

    function handleCollectionPress(collection: any) {
        setSelectedCollection(collection);
    }

    function handleSelectItem(itemName: string) {
        const selected = collections.find(c => c.name === itemName);
        setSelectedCollection(selected || null);
    }

    useEffect(() => {
        if (selectedCollection) {
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }, 100);
        }
    }, [selectedCollection]);

    useEffect(() => {
        async function fetchSeries() {
            setLoading(true);
            try {
                const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
                const { data, error } = await supabase.functions.invoke('collections', {
                    method: 'GET',
                    headers: {
                        Authorization: jwt ? `Bearer ${jwt}` : '',
                    },
                });
                if (error) {
                    console.error('Error fetching series:', error.message);

                } else if (data && Array.isArray(data.data)) {
                    console.log("Collections::", data.data)
                    setCollections(data.data);
                }
            } catch (e) {
                console.error('Error fetching focus modes:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchSeries();
    }, []);

    return (
        <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.rootContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Top background */}
                        <Image
                            source={require("@/assets/images/kid/top-back-pattern.png")}
                            style={styles.topBackPattern}
                            resizeMode="cover"
                        />
                        <Header role="kid" mode={child?.mode} />
                        {/* Header */}
                        <ThemedText style={styles.headerTitle}>StoryCloud Map</ThemedText>

                        {/* Characters and Landmarks buttons */}


                        <ThemedView style={styles.headerCloudWrap}>
                            {/* Clouds */}
                            <Image
                                source={require("@/assets/images/kid/cloud-group-far.png")}
                                style={styles.imgCloudFar}
                                resizeMode="cover"
                            />
                            <Image
                                source={require("@/assets/images/kid/cloud-group-near.png")}
                                style={styles.imgCloudNear}
                                resizeMode="cover"
                            />
                            {/* Header */}
                            <ThemedView style={{ paddingTop: 25, paddingHorizontal: 16, width: '100%' }}>
                                <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>StoryCloud Series</ThemedText>
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
                        <CardSeries data={cardsData} active="Map" />


                        <>
                            <ThemedView style={{ height: 1000, width: "100%", marginBottom: 80 }}>
                                <MapWrapper />
                            </ThemedView>
                            <Image
                                source={require("@/assets/images/kid/cloud-group-near.png")}
                                style={styles.imgCloudNear2}
                                resizeMode="cover"
                            />
                            <ThemedView style={styles.mainContent}>
                                <ThemedView style={styles.content}>


                                    <ThemedView style={{ paddingBottom: 80, paddingTop: 40, gap: 20 }}>
                                        {collections.map((collection, index) => (
                                            <React.Fragment key={index}>
                                                <SectionHeader
                                                    title={collection.name}
                                                    desc={collection.description}
                                                    link="continue"
                                                    onPress={() => handleCollectionPress(collection)}
                                                />
                                                <ScrollView
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    contentContainerStyle={styles.cardScrollContainer}
                                                >
                                                    {storiesData
                                                        .map((item, idx) => (
                                                            <StoryCard2 key={idx} {...item} />
                                                        ))}
                                                </ScrollView>
                                            </React.Fragment>
                                        ))}
                                    </ThemedView>
                                </ThemedView>
                            </ThemedView>
                        </>
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
        </>
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
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        marginBottom: 50,
        marginTop: 50,
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
        height: "100%",
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
        width: "150%",
        height: "7%",
        position: "absolute",
        top: 10 * 120,
        left: 0,

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
        borderRadius: 20,
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