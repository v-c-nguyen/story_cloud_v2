import { getSeriesByStoryId } from "@/api/series";
import { StoryCard1 } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useListenStore } from "@/store/listenStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

export default function WatchNext({ activeChild }: { activeChild: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const activeStoryId = useListenStore((state) => state.activeStoryId);
  const setSeries = useListenStore((state) => state.setSeries);
  const setStories = useListenStore((state) => state.setStories);
  const [displayStories, setDisplayStories] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchSeriesWithActiveStory(activeStoryId: string) {
      setLoading(true);
      try {
        const data = await getSeriesByStoryId(activeStoryId ?? '', activeChild.id);
        if (!isMounted) return;
        if (data && Array.isArray(data.stories)) {
          setSeries(data.series);
          setStories(data.stories);
          const index = data.stories.findIndex(
            (story: any) => story.storyId === activeStoryId
          );
          useListenStore.getState().setCurrentIndex(index);
          setDisplayStories(index >= 0 ? data.stories.slice(index + 1) : []);
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

    if (activeStoryId && activeChild?.id) {
      fetchSeriesWithActiveStory(activeStoryId);
    } else {

      setLoading(false);
      setDisplayStories([]);
      setSeries(null);
      setStories([]);
    }

    return () => {
      isMounted = false;
    };
  }, [activeChild, activeStoryId, setSeries, setStories]);

  return (
    <>
      {loading ? (
        <ActivityIndicator color="#ffffff" style={{ zIndex: 999 }} />
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
          <ThemedText style={{ color: "#ffffff7a" }}>
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