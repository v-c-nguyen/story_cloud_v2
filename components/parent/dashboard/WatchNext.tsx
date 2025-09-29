import { getSeriesByStoryId } from "@/api/series";
import { StoryCard1 } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useListenStore } from "@/store/listenStore";
import { useStoryStore } from "@/store/storyStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

export default function WatchNext({ activeChild, mode }: { activeChild: any, mode: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const activeStoryId = useListenStore((state) => state.activeStoryId);
  const featuredStories = useStoryStore((state) => state.featuredStories);
  const setSeries = useListenStore((state) => state.setSeries);
  const setStories = useListenStore((state) => state.setStories);
  const [displayStories, setDisplayStories] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchSeriesWithActiveStory(activeStoryId: string) {
      setLoading(true);
      try {
        const data = await getSeriesByStoryId(activeStoryId, activeChild.id);
        if (!isMounted) return;
        if (data && Array.isArray(data.stories)) {
          setSeries(data.series);
          setStories(data.stories);
          const index = data.stories.findIndex(
            (story: any) => story.storyId === activeStoryId
          );
          setDisplayStories(index >= 0 ? data.stories.slice(index + 1) : []);

          useListenStore.getState().setCurrentIndex(index);
        } else {
          setLoading(false);
          setSeries(null);
          setStories([]);
          setDisplayStories([]);
        }
      } catch (error) {
        setSeries(null);
        setStories([]);
        setDisplayStories([]);
        setLoading(false);
        console.error("Error fetching series:", error);
      } finally {
        setLoading(false);
        if (isMounted) setLoading(false);
      }
    }

    if ((featuredStories[0] || activeStoryId) && activeChild.id) {

      fetchSeriesWithActiveStory(activeStoryId ?? featuredStories[0]?.storyId);
    } else {
      setLoading(false);
      setDisplayStories([]);
      setSeries(null);
      setStories([]);
    }

    return () => {
      isMounted = false;
    };
  }, [activeStoryId, featuredStories]);

  return (
    <>
      {loading ? (
        <ActivityIndicator color={mode === "parent" ? "#ffffff" : "#053B4A"} style={{ zIndex: 999 }} />
      ) : displayStories.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardScrollContainer}
        >
          {displayStories
            .filter((ele) => !ele.watched)
            .map((item, idx) => (
              <StoryCard1
                key={item.storyId || idx}
                num={idx + 1}
                story={item}
                onPlay={(storyId: string) =>
                  router.push({
                    pathname: "/(parent)/(listen)/listenStory",
                    params: { storyId },
                  })
                }
              />
            ))}
        </ScrollView>
      ) : (
        <ThemedView
          style={{
            flexDirection: "row",
            width: "100%",
            marginVertical: 20,
            justifyContent: "center",
          }}
        >
          <ThemedText style={{ color: mode === "parent" ? "#ffffff7a" : "#053B4A" }}>
            {" "}
            no story data{" "}
          </ThemedText>
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardScrollContainer: {
    gap: 10,
    marginBottom: 100,
  },
});