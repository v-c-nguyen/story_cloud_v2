import supabase from "@/app/lib/supabase";
import { useUser } from "@/app/lib/UserContext";
import BottomNavBar from "@/components/BottomNavBar";
import { StoryCard2 } from "@/components/Cards";
import { PatternBackground } from "@/components/PatternBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

type RoleType = "kid" | "parent";

const storiesData = [
    {
        bgColor: "#F4A672",
        textColor: "#053B4A",
        subTextColor: "#F8ECAE",
        progressColor: "#ADD7DA",
        isBallonYellow: true,
        number: "#1",
        storyTitle: "Petal Tales: The Search for Rainbow Flowers",
        seriesTitle: "KAI’S LIVING ADVENTURE",
        duration: 32,
        progress: 20,
        image: "1",
        featured: false,
        isFavorite: true,
        watched: false,
    },
    {
        bgColor: "#053B4A",
        textColor: "#FCFCFC",
        subTextColor: "#F8ECAE",
        progressColor: "#F8ECAE",
        isBallonYellow: false,
        number: "#2",
        storyTitle: "Petal Tales: The Search for Rainbow Flowers",
        seriesTitle: "Underwater Adventures",
        duration: 32,
        progress: 12,
        image: "2",
        featured: false,
        isFavorite: true,
        watched: false,
    },
    {
        bgColor: "#F8ECAE",
        textColor: "#053B4A",
        subTextColor: "#048F99",
        progressColor: "#ADD7DA",
        isBallonYellow: false,
        number: "#3",
        storyTitle: "Muddy Mystery at the Pond",
        seriesTitle: "KAI’S LIVING ADVENTURE",
        duration: 32,
        progress: 20,
        image: "3",
        featured: true,
        isFavorite: true,
        watched: false,
    },
    {
        bgColor: "#053B4A",
        textColor: "#FCFCFC",
        subTextColor: "#F8ECAE",
        progressColor: "#F8ECAE",
        isBallonYellow: true,
        number: "#4",
        storyTitle: "Seeds of Surprise",
        seriesTitle: "KAI’S LIVING ADVENTURE",
        duration: 32,
        progress: 12,
        image: "2",
        featured: true,
        isFavorite: true,
        watched: false,
    },
    {
        bgColor: "#F8ECAE",
        textColor: "#053B4A",
        subTextColor: "#F8ECAE",
        progressColor: "#F4A672",
        isBallonYellow: true,
        number: "#5",
        storyTitle: "The Great Garden Clean-Up",
        seriesTitle: "KAI’S LIVING ADVENTURE",
        duration: 32,
        progress: 20,
        image: "1",
        featured: false,
        isFavorite: true,
        watched: true,
    },
    {
        bgColor: "#053B4A",
        textColor: "#FCFCFC",
        subTextColor: "#F8ECAE",
        progressColor: "#ADD7DA",
        isBallonYellow: false,
        number: "#7",
        storyTitle: "A Night with Nocturnal Neighbours",
        seriesTitle: "KAI’S LIVING ADVENTURE",
        duration: 32,
        progress: 20,
        image: "3",
        featured: false,
        isFavorite: false,
        watched: true,
    },
];

export default function DetailsScreen() {
    const router = useRouter();
    const { from } = useLocalSearchParams<{ from?: string }>();
    const [showMenu, setShowMenu] = React.useState(false);
    const [role, setRole] = React.useState<RoleType>("parent");

    const { user, setUser } = useUser();

    React.useEffect(() => {
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const expiresAt = session?.expires_at; // Unix timestamp (seconds)
            const now = Math.floor(Date.now() / 1000);

            if (
                !user ||
                !token ||
                !expiresAt ||
                expiresAt < now // Token is expired
            ) {
                handleSignout();
            }
        }
        checkAuth();
    }, [user]);

    async function handleSignout() {
        setShowMenu(false);
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert(error.message);
            return;
        }
        router.navigate("/(auth)");
    }

    function toKidMode() {
        setShowMenu(false);
        setRole("kid");
        router.replace("/(auth)");
    }

    return (
        <PatternBackground>

            <SafeAreaView style={styles.safeAreaContainer}>
                <ThemedView style={styles.backgroundColorContainer}>
                    <ThemedView>
                        <ThemedView style={styles.headingWrap}>
                            <Image
                                source={require("@/assets/images/kid/logo-ballon.png")}
                                style={
                                    styles.logoBallon}
                                contentFit="cover"
                            />
                            <ThemedView style={styles.headerTitleStyle}>
                                <TouchableOpacity onPress={() => router.back()} style={styles.headerTitleStyle}>
                                    <Image
                                        source={require("@/assets/images/kid/arrow-left.png")}
                                        style={styles.titleIcon}
                                    />
                                    <ThemedText
                                        style={
                                            styles.headTextStyle
                                        }
                                    >
                                        {"Back to Library"}
                                    </ThemedText>
                                </TouchableOpacity>
                            </ThemedView>

                            <ThemedView style={styles.headerRow}>
                                <ThemedView style={styles.parentIconGroup}>
                                    <Image
                                        source={require("@/assets/images/parent/header/icon-parent.png")}
                                        style={styles.parentIcon}
                                        contentFit="cover"
                                    />
                                    <Image
                                        source={require("@/assets/images/parent/orange-circle.png")}
                                        style={styles.setCirclePosition}
                                        contentFit="cover"
                                    />
                                </ThemedView>
                                <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                                    <Image
                                        source={require("@/assets/images/parent/header/icon-down.png")}
                                        style={styles.logodown}
                                        contentFit="cover"
                                    />
                                </TouchableOpacity>

                                {showMenu &&
                                    <ThemedView style={styles.dropdown}>
                                        <TouchableOpacity onPress={handleSignout}>
                                            <ThemedView style={styles.dropdownItem}>
                                                <ThemedText style={styles.dropdownText}>Log out</ThemedText>
                                            </ThemedView>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={toKidMode}>
                                            <ThemedView style={styles.dropdownItem}>
                                                <ThemedText style={styles.dropdownText}>Kid Mode</ThemedText>
                                            </ThemedView>
                                        </TouchableOpacity>
                                    </ThemedView>
                                }
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            {/* </SafeAreaView> */}

            <Stack.Screen options={{ headerShown: false }} />

            {/* <SafeAreaView style={styles.safeAreaContainer}> */}
                <ThemedView style={styles.themedViewContainer}>
                    <ScrollView
                        style={styles.rootContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        <ThemedView style={styles.selectionContainer}>
                            <ThemedText style={[styles.sectionTitle, styles.sectionTitleMarginTop]}>
                                {typeof from === 'string' && from.length > 0 ? from : "Library"}
                            </ThemedText>
                            <ThemedText style={[styles.sectionTitle, styles.sectionTitleColor]}>
                                {"Series"}
                            </ThemedText>
                            <ThemedText style={[styles.sectiondesc, styles.sectionDescCenter]}>
                                {"  Kai, the adventurous Australian Shepherd, explores forests, gardens, and ponds to discover how plants and animals live together in an interconnected world. He takes his friends on fun quests—like finding missing pollinators, rescuing a burrow from collapse, or learning about hidden seeds—that reveal the wonders of nature."}
                            </ThemedText>
                            <TouchableOpacity style={styles.button} onPress={() => { }} activeOpacity={0.7}>
                                <Ionicons name="add" size={30} color="#0D4B4F" style={styles.addButtonIcon} />
                                <Text style={styles.ButtonText}>Add Series to Pathway</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={[styles.cardScrollContainer, { paddingLeft: 30, paddingTop: 30 }]}
                            >
                                {storiesData
                                    .filter((ele) => !ele.watched)
                                    .map((item, idx) => (
                                        <StoryCard2 key={idx} {...item} />
                                    ))}
                            </ScrollView>
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
                        <BottomNavBar role="parent" active="Learning" subActive="Library" />
                    </ThemedView>
                </ThemedView>
            </SafeAreaView>
        </PatternBackground>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: "rgba(5, 59, 74, 1)",
        position: "relative",
        paddingBottom: 60
    },
    selectionContainer: {
        paddingBottom: 120,
        alignItems: "center",
        borderColor: "rgba(122, 193, 198, 0.5)",
        borderWidth: 1,
        backgroundColor: "rgba(5, 59, 74, 1)",
        marginTop: 10,
        borderRadius: 30,
        marginHorizontal: 16,
    },
    sectionTitle: {
        color: "#ffffff",
        fontSize: 24,
        marginTop: 60,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontWeight: "700",
        lineHeight: 24,
    },
    sectiondesc: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "400",
        fontStyle: 'italic',
        lineHeight: 24,
    },
    cardScrollContainer: {
        gap: 20,
        paddingHorizontal: 16,
    },
    detailsSection: {
        marginBottom: 5,
        width: "100%",
        marginTop: 40,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ECA36D",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 50,
    },
    ButtonText: {
        color: "#0D4B4F",
        fontSize: 20,
        fontWeight: "400",
    },
    headingWrap: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginVertical: 20,
    },
    logoBallon: {
        width: 48,
        height: 48,
        tintColor: 'rgba(122, 193, 198, 1)'
    },
    headTextStyle: {
        fontSize: 18,
        marginLeft: 10,
        color: 'rgba(122, 193, 198, 1)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontWeight: '500',
    },
    parentIconGroup: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: 50,
        height: 50
    },
    parentIcon: {
        width: 32,
        height: 32,
        position: 'absolute',
        right: 5
    },
    setCirclePosition: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 26,
        height: 26,
        zIndex: -10,
    },
    headerTitleStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    logo20: {
        width: 20,
        height: 20
    },
    logodown: {
        width: 24,
        height: 24,
        tintColor: 'white',
    },
    dropdown: {
        width: 180,
        position: 'absolute',
        right: 0,
        bottom: 0,
        transform: [{ translateY: 100 }],
        flexDirection: 'column',
        backgroundColor: 'rgba(5, 59, 74, 1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        padding: 5,
        zIndex: 999
    },
    dropdownItem: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    dropdownText: {
        color: 'rgba(122, 193, 198, 1)',
        fontSize: 16,
        fontWeight: '400'
    },
    titleIcon: {
        width: 32,
        height: 32,
        right: 5,
        tintColor: 'rgba(122, 193, 198, 1)'
    },
    backgroundColorContainer: {
        backgroundColor: "rgba(5, 59, 74, 1)"
    },
    headerRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center"
    },
    safeAreaContainer: {
        flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)'
    },
    themedViewContainer: {
        flex: 1,
        display: "flex",
        position: "relative"
    },
    scrollViewContent: {
        paddingBottom: 55
    },
    sectionTitleMarginTop: {
        marginTop: 40
    },
    sectionTitleColor: {
        marginTop: 10,
        color: "#048F99"
    },
    sectionDescCenter: {
        marginBottom: 5,
        padding: 20,
        textAlign: "center"
    },
    addButtonIcon: {
        marginRight: 6
    }
});