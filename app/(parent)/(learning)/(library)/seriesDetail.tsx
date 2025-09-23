import supabase from '@/app/lib/supabase';
import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconPlus from "@/assets/images/parent/icon-plus.svg"
import IconBallon from "@/assets/images/icons/FilledBallon.svg"
import { useStoryStore } from '@/store/storyStore';
import GradientText from '@/components/ui/GradientText';
import { useSeriesStore } from '@/store/seriesStore';
import StoryItems from '@/components/parent/learning/library/StoryItems';
import useIsMobile from '@/hooks/useIsMobile';

export default function seriesDetail() {
    const isMobile = useIsMobile();
    const router = useRouter();
    const params = useLocalSearchParams();
    const seriesId = typeof params.id === "string" ? params.id : "";
    const currentSeries = useSeriesStore((state) => state.currentSeries);
    const setCurrentSeries = useSeriesStore((state) => state.setCurrentSeries);


    useEffect(() => {
        async function fetchSeries() {
            try {
                const jwt =
                    supabase.auth.getSession &&
                    (await supabase.auth.getSession())?.data?.session?.access_token;
                const { data, error } = await supabase.functions.invoke(
                    `series/getSeriesById/${seriesId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: jwt ? `Bearer ${jwt}` : "",
                        },
                    }
                );
                if (error) {
                    console.error("Error fetching series:", error.message);
                } else if (data) {
                    if (setCurrentSeries) {
                        setCurrentSeries(data)
                    }
                }
            } catch (e) {
                console.error("Error fetching focus modes:", e);
            } finally {
            }
        }
        fetchSeries();
    }, []);

    function handleBackBtn() {
        if (setCurrentSeries)
            setCurrentSeries(null)
        router.back()
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, display: "flex", height: 500 }}>
                <ScrollView
                    style={styles.rootContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Top background */}
                    <Image
                        source={require("@/assets/images/parent/parent-back-pattern.png")}
                        style={[styles.topBackPattern, {
                            height: '100%'
                        }
                        ]}
                        resizeMode="cover"
                    />

                    <Header role="parent" theme="dark"></Header>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={handleBackBtn}>
                        <IconArrowLeft width={20} height={20} color={"#7AC1C6"} />
                        <ThemedText style={styles.backBtnText}>Back to Learning</ThemedText>
                    </TouchableOpacity>

                    <ThemedView style={styles.mainContainer}>
                        <ThemedView style={styles.mainCard}>
                            {/* Main Part */}
                            <ThemedView style={{ paddingHorizontal: 16, marginTop: 30 }}>
                                <ThemedText style={styles.mainTitle}>
                                    {currentSeries?.name || ""}
                                </ThemedText>
                                <ThemedText style={styles.cntTitle}>
                                    {currentSeries?.stories?.length || ""} Stories
                                </ThemedText>
                                <ThemedText style={styles.subtitle}>
                                    {currentSeries?.description_parent || ""}
                                </ThemedText>
                            </ThemedView>

                            <TouchableOpacity
                                style={[styles.button]}
                                onPress={() => { }}
                                activeOpacity={0.7}
                            >
                                <ThemedView style={styles.addButtonTextContainer}>
                                    <IconPlus width={18} height={18} color={"#053B4A"} />
                                    <ThemedText style={styles.ButtonText}>
                                        Add Series to Pathway
                                    </ThemedText>
                                </ThemedView>
                            </TouchableOpacity>
                            <ThemedView style={{ width: "100%", flexDirection: "row", justifyContent: 'center' }}>
                                <StoryItems
                                    seriesCategory={currentSeries?.name || ""}
                                    tag="series"
                                    mode="parent"
                                    direction="vertical"
                                    seriesCategories={currentSeries}
                                    filter={"stories"}

                                />
                            </ThemedView>
                        </ThemedView>

                    </ThemedView>
                </ScrollView>
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
                    <BottomNavBar role="parent" active="Learning" subActive={isMobile ? "Library" : ""} image={!isMobile ? true : false} />
                </ThemedView>
            </SafeAreaView>
        </>
    )
}


const styles = StyleSheet.create({

    rootContainer: {
        flex: 1,
        backgroundColor: "rgba(5, 59, 74, 1)",
        position: "relative",
        paddingBottom: 60
    },
    cardImg: {
        width: "100%",
        height: 150,
        resizeMode: "cover",
    },
    topBackPattern: {
        width: "100%",
        height: "100%",
        maxHeight: 1200,
        position: "absolute",
    },
    mainContainer: {
        marginBottom: 100,
        flexDirection: "row",
        justifyContent: "center"
    },
    mainCard: {
        borderWidth: 2,
        borderColor: "rgba(173,215,218,0.2)",
        backgroundColor: "#053B4A",
        width: "90%",
        paddingBottom: 60,
        borderRadius: 30,
        overflow: "hidden"
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    cntTitle: {
        color: "#7AC1C6",
        fontSize: 18,
        fontWeight: 700,
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 24,
    },
    titleIcon: {
        width: 24,
        height: 24,
        tintColor: 'rgba(122, 193, 198, 1)'
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: 'white'
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
        top: -35,
    },
    backBtnIcon: {

    },
    backBtnText: {
        color: 'rgba(122, 193, 198, 1)',
        fontSize: 14,
        fontWeight: 400
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: 'rgba(5, 59, 74, 1)',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(173, 215, 218, 0.2)',
        width: 300,
        height: 475,
        marginRight: 16,
        padding: 16,
        justifyContent: 'space-between',
    },
    icon: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 12,
        marginTop: 20
    },
    description: {
        marginTop: 25,
        color: 'white',
        fontWeight: 400,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    highlight: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#fba864',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 20,
        gap: 10
    },
    addButtonIcon: {
        marginRight: 6,
    },
    addButtonTextContainer: {
        alignItems: "center",
        flexDirection: "row",
        gap: 10
    },
    ButtonText: {
        color: "#0D4B4F",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonText: {
        color: '#003b4f',
        fontWeight: '400',
        fontSize: 16,
    },
    arrow: {
        color: '#003b4f',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },

    topCircle: {
        borderWidth: 1,
        borderColor: "rgba(173,215,218,0.5)",
        width: 57,
        height: 57,
        borderRadius: 50,
        marginHorizontal: "auto",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    topCircleText: {
        color: "rgba(248, 236, 174, 1)",
        fontWeight: "700",
        lineHeight: 28.8,
        textAlign: "center",
        fontSize: 24,
    },
    adventureHeader: {
        marginHorizontal: 18,
        color: "#FFE7A0",
        fontWeight: 700,
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    mainTitle: {
        color: "#fff",
        fontWeight: 700,
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 33.6,
    },
    subtitle: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
        fontWeight: 400,
        lineHeight: 21.6,
        marginBottom: 30,
    },
    continueBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 5,
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
    learningTarget: {
        borderWidth: 1,
        borderRadius: 70,
        paddingHorizontal: 8,
        paddingVertical: 15,
    },
    descriptionText: {
        color: "#053B4A",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 18.9,
        fontWeight: 400,
    },
    targetContainer: {
        marginTop: 60,
        marginHorizontal: 20,
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: "rgba(173,215,218,0.2)",
        borderRadius: 20,
        flexDirection: "column",
        gap: 25
    },
    ballonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(173,215,218,1)",
    }
})