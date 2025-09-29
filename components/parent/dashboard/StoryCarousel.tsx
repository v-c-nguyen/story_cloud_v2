import { getAllTracksByChildId } from "@/api/track";
import { StoryCard } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useListenStore } from "@/store/listenStore";
import { useStoryStore } from "@/store/storyStore";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
export default function RecentLearning({ activeChild, mode = "parent", watched = false }: {
    activeChild: any;
    mode?: string;
    watched?: boolean;
}) {
    const setRecentStories = useStoryStore((state) => state.setRecentStories);
    const setActiveStoryId = useListenStore((state) => state.setActiveStoryId);
    const [loading, setLoading] = React.useState(false);
    const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
    const [recents, setRecents] = React.useState<any[]>([]);

    useEffect(() => {
        // Function to fetch tracks for activeChild
        const fetchRecents = async () => {
            setLoading(true);
            try {
                const recentsData = await getAllTracksByChildId(activeChild?.id);
                setRecentStories(recentsData);
                const temp = recentsData.slice(0, 3).filter((ele: any) => !ele.watched);
                setRecents(temp);
                setActiveStoryId(recentsData[0]?.story_id || null);
            } finally {
                setLoading(false);
            }
        };
        if (activeChild?.id) {
            fetchRecents();
        } else {
            setRecents([]);
        }
    }, [activeChild]);
    return (
        <>
            {recents.length > 0 ?
                <ThemedView>
                    {
                        watched && recents.filter((ele) => ele.watched).length <= 0 && !loading ? (
                            <ThemedText style={{ color: mode == "parent" ? '#ffffff7a' : "#053B4A", textAlign: 'center', marginVertical: 20 }}> no recent data </ThemedText>
                        )
                            :
                            !watched && recents.filter((ele) => !ele.watched).length <= 0 && !loading && (
                                <ThemedText style={{ color: mode == "parent" ? '#ffffff7a' : "#053B4A", textAlign: 'center', marginVertical: 20 }}> no recent data </ThemedText>
                            )
                    }
                </ThemedView>
                :
                <ThemedText style={{ color: mode == "parent" ? '#ffffff7a' : "#053B4A", textAlign: 'center', marginVertical: 20 }}> no recent data </ThemedText>
            }
            {loading ? (
                <ActivityIndicator color={mode == "parent" ? "#ffffff" : "#053B4A"} style={{
                    zIndex: 999,
                    marginVertical: 50,
                }} />
            ) :
                recents.length > 0 &&
                <ThemedView>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onScroll={event => {
                            const x = event.nativeEvent.contentOffset.x;
                            const cardWidth = 290 + 25; // card width + gap (adjust if needed)
                            const index = Math.round(x / cardWidth);
                            setCurrentCardIndex(index);
                        }}
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.cardScrollContainer}
                    >
                        {!watched ?
                            recents
                                .filter((ele) => !ele.watched)
                                .map((item, idx) => (
                                    <StoryCard key={idx} num={idx + 1} recent={item} />
                                )) :
                            recents
                                .filter((ele) => ele.watched)
                                .map((item, idx) => (
                                    <StoryCard key={idx} num={idx + 1} recent={item} />
                                ))}
                    </ScrollView>
                    {/* Pagination Dots */}
                    <ThemedView style={styles.pagination}>
                        {recents && recents.length > 1 && recents.map((_, idx) => (
                            <ThemedView
                                key={idx}
                                style={[
                                    styles.dot,
                                    idx === currentCardIndex && styles.activeDot,
                                ]}
                            />
                        ))}
                    </ThemedView>
                </ThemedView>

            }
        </>
    );
}

const styles = StyleSheet.create({
    cardScrollContainer: {
        gap: 20,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 50,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'rgba(122, 193, 198, 1)',
        margin: 4,
    },
    activeDot: {
        backgroundColor: 'rgba(122, 193, 198, 1)',
    },
});
