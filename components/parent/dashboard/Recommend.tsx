import supabase from "@/app/lib/supabase";
import { StoryCard, StoryCard1, StoryCard3 } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useStoryStore } from "@/store/storyStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

export default function Recommend({ activeChild, mode = "parent" }: { activeChild: any, mode?: string }) {
    const router = useRouter();
    const setFeaturedStories = useStoryStore((state) => state.setFeaturedStories);
    const recentStories = useStoryStore((state) => state.recentStories);
    const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
    const [storiesData, setStoriesData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        // Function to fetch stories
        async function fetchStories(childId: string) {
            if (!childId) return;
            setLoading(true);
            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
            const { data, error } = await supabase.functions.invoke(`stories/children/${childId}`, {
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                    'Content-Type': 'application/json',
                },
            });
            setLoading(false);
            if (error) {
                alert(error)
                console.error('Error fetching stories:', error.message);
                return;
            }
            if (data && Array.isArray(data.stories)) {
                const incoming: any[] = data.stories;
                // build set of recent ids (storyId or id)
                if (recentStories.length > 0) {
                    const recentIds = recentStories.map(r => r?.story_id );
                    console.log(recentIds, "recentIds");
                    const filtered = incoming.filter(story => !recentIds.includes(story.storyId || story.id));
                    setFeaturedStories(filtered);
                    setStoriesData(filtered.slice(0, 3));
                } else {
                    setFeaturedStories(incoming);
                    setStoriesData(incoming.slice(0, 3));
                }
            }
        }
        fetchStories(activeChild?.id);
    }, [activeChild, recentStories])

    return (
        <ThemedView>
            {
                loading ? (
                    <ActivityIndicator color={mode == "parent" ? "#ffffff" : "#053B4A"} style={{
                        zIndex: 999,
                        marginVertical: 50,
                    }} />
                ) :
                    storiesData.length <= 0 && !loading ? (
                        <ThemedText style={{ color: mode == "parent" ? '#ffffff7a' : "#053B4A", textAlign: 'center', marginVertical: 20 }}> no recommeded data </ThemedText>
                    ) :
                        storiesData.length > 0 ?
                            <ThemedView>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    onScroll={event => {
                                        const x = event.nativeEvent.contentOffset.x;
                                        const cardWidth = 290 + 10; // card width + gap (adjust if needed)
                                        const index = Math.round(x / cardWidth);
                                        setCurrentCardIndex(index);
                                    }}
                                    scrollEventThrottle={16}
                                    contentContainerStyle={styles.cardScrollContainer}
                                >
                                    {mode == "parent" ?
                                        storiesData
                                            // .filter((ele) => !ele.watched)
                                            .map((item, idx) => (
                                                <StoryCard1
                                                    key={idx}
                                                    num={idx + 1}
                                                    story={item}
                                                    onPlay={(storyId: string) => router.push({ pathname: '/(parent)/(listen)/listenStory', params: { storyId } })}
                                                />
                                            )) :
                                        storiesData
                                            // .filter((ele) => !ele.watched)
                                            .map((item, idx) => (
                                                <StoryCard3
                                                    key={idx}
                                                    num={idx + 1}
                                                    story={item}
                                                    onPlay={(storyId: string) => router.push({ pathname: '/(kid)/(listen)/listenStory', params: { storyId } })}
                                                />
                                            ))
                                    }

                                </ScrollView>

                                {/* Pagination Dots */}
                                <ThemedView style={styles.pagination}>
                                    {storiesData && storiesData.length > 1 && storiesData.map((_, idx) => (
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
                            :
                            <ThemedView style={{ flexDirection: 'row', width: '100%', marginVertical: 20, justifyContent: 'center' }}>
                                <ThemedText style={{ color: '#ffffff7a' }}> no recommended data </ThemedText>
                            </ThemedView>
            }
        </ThemedView>
    )
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
