import { StoryCard2 } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SearchScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const handleSearchChange = (text: string) => {
        setSearchText(text);

        if (text.trim().length > 0) {
            const dummyResults = [
                {
                    bgColor: "#FFF",
                    textColor: "#000",
                    subTextColor: "#888",
                    progressColor: "#F8ECAE",
                    isBallonYellow: true,
                    number: "1",
                    storyTitle: text.trim(),
                    seriesTitle: "Demo Series",
                    duration: 10,
                    progress: 5,
                    image: "1",
                    featured: false,
                    isFavorite: false,
                    watched: false,
                },
                {
                    bgColor: "#FFF",
                    textColor: "#000",
                    subTextColor: "#888",
                    progressColor: "#F8ECAE",
                    isBallonYellow: false,
                    number: "2",
                    storyTitle: `${text.trim()} Adventure`,
                    seriesTitle: "Adventure Series",
                    duration: 8,
                    progress: 2,
                    image: "2",
                    featured: false,
                    isFavorite: true,
                    watched: false,
                },
                {
                    bgColor: "#FFF",
                    textColor: "#000",
                    subTextColor: "#888",
                    progressColor: "#F8ECAE",
                    isBallonYellow: true,
                    number: "3",
                    storyTitle: `${text.trim()} Returns`,
                    seriesTitle: "Fantasy Tales",
                    duration: 15,
                    progress: 10,
                    image: "3",
                    featured: false,
                    isFavorite: false,
                    watched: true,
                },
            ];
            setResults(dummyResults);
        } else {
            setResults([]);
        }
    };

    const handleClear = () => {
        setSearchText("");
        setResults([]);
    };

    const handleSubmit = () => {
        Keyboard.dismiss();
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>
                <ThemedView style={styles.container}>

                    {/* Header */}
                    <View style={styles.header}>
                        <ThemedText style={styles.headerText}>
                            {searchText.trim().length === 0
                                ? "Search"
                                : `${results.length} Result${results.length !== 1 ? "s" : ""}`}
                        </ThemedText>
                        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>




                    {/* Search results */}
                    {results.length > 0 ? (
                        <View style={styles.content}>
                            <View style={styles.headerTitleContainer}>
                                <View>
                                    <View style={[styles.avatarImgContainer, { width: 60, height: 60, justifyContent: "center", alignItems: "center", marginBottom: 10, margin: 18 }]}>
                                        <Image
                                            source={require("@/assets/images/avatars/dano_badger.png")}
                                            style={[styles.avatarImg]}
                                        />
                                    </View>
                                    <ThemedText style={[styles.sectionTitle, styles.selectionTitleLarge]}>{`${searchText} Characters`}</ThemedText>
                                    <ThemedText style={[styles.sectionTitle, styles.selectionTitleSmall]}>{"Kids' favorite story characters"}</ThemedText>
                                </View>
                                <TouchableOpacity
                                    onPress={() => { }}
                                >
                                    <Image
                                        source={require("@/assets/images/kid/arrow-right.png")}
                                        style={styles.arrow}
                                    />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                horizontal
                                data={results}
                                keyExtractor={(_, index) => index.toString()}
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item }) => (
                                    <View style={styles.searchCardWrapper}>
                                        <StoryCard2 {...item} />
                                    </View>
                                )}
                            />


                        </View>

                    ) : (
                        searchText.trim().length > 0 && (
                            <View style={styles.noResults}>
                                <ThemedText>No results found</ThemedText>
                            </View>
                        )
                    )}

                    {/* Search bar */}
                    <View
                        style={[
                            styles.searchBarContainer,
                            { bottom: keyboardHeight > 0 ? keyboardHeight : 0 },
                            searchText.trim().length > 0 && styles.searchBarTopBorder
                        ]}
                    >
                        <View
                            style={[
                                styles.searchWrapper,
                                searchText.trim().length > 0 && styles.activeSearchWrapper,
                            ]}
                        >
                            <Ionicons
                                name="search"
                                size={18}
                                color={searchText.trim().length > 0 ? "#E8A44D" : "rgba(122, 193, 198, 1)"}
                                style={{ marginHorizontal: 8 }}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Type to Search"
                                placeholderTextColor="rgba(122, 193, 198, 1)"
                                value={searchText}
                                onChangeText={handleSearchChange}
                                onSubmitEditing={handleSubmit}
                                returnKeyType="search"
                            />
                            {searchText.trim().length > 0 && (
                                <TouchableOpacity onPress={handleClear}>
                                    <Text style={styles.clearIcon}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                </ThemedView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "rgba(5, 59, 74, 1)" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(122, 193, 198, 1)",
    },
    headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(122, 193, 198, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    closeIcon: { color: "#fff", fontSize: 18 },
    content: { flex: 1, paddingHorizontal: 16 },
    listContent: { paddingTop: 8, paddingBottom: 80 },
    noResults: { flex: 1, justifyContent: "center", alignItems: "center" },
    searchBarContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "rgba(5,59,74,1)",
    },
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(122, 193, 198, 1)",
        borderRadius: 25,
        backgroundColor: "rgba(5,59,74,1)",
        height: 45,
    },
    activeSearchWrapper: {
        borderColor: "#E8A44D",
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#fff",
        paddingRight: 10,
    },
    clearIcon: {
        color: "#E8A44D",
        fontSize: 18,
        marginHorizontal: 8,
    },
    searchBarTopBorder: {
        borderTopWidth: 1,
        borderTopColor: "rgba(122, 193, 198, 1)",
        paddingTop: 40,
        paddingBottom: 10,

    },
    searchCardWrapper: {
        marginRight: 12,
    },
    selectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarImgContainer: {
        padding: 10,
        borderColor: "#ffffff",
        borderWidth: 1.5,
        marginRight: 10,
        borderRadius: 999,
        backgroundColor: "rgba(122, 193, 198, 1)"
    },
    avatarImg: {
        height: 30,
        width: 30,
    },
    arrow: {
        tintColor: "#F4A672",
        marginRight: 16,
        marginBottom: 10
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
    selectionTitleLarge: {
        marginTop: 0,
        fontSize: 30,
        lineHeight: 0
    },
    selectionTitleSmall: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: "100"
    },
    headerTitleContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between"
    },

});