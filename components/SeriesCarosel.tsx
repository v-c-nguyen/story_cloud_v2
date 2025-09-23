import { getAllTracksByChildId } from "@/api/track";
import { Child } from "@/app/lib/UserContext";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ViewToken,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useListenStore } from "@/store/listenStore";
import IconPlay from "@/assets/images/icons/play.svg";
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg";
import IconArrowRight from "@/assets/images/icons/arrow-right.svg";

const { width } = Dimensions.get("window");

export default function SeriesCarousel({
  mode,
  activeChild,
}: {
  mode: string;
  activeChild: Child;
}) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recents, setRecents] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const setActiveStoryId = useListenStore((state) => state.setActiveStoryId);

  useEffect(() => {
    const fetchRecents = async () => {
      setLoading(true);
      try {
        const result = await getAllTracksByChildId(activeChild?.id);
        if (!Array.isArray(result) || result.length === 0) {
          setRecents([]);
          setActiveStoryId('');
          return;
        }
        const unwatched = result.filter((item) => item && item.stories && !item.watched);
        setRecents(unwatched.slice(0, 3));
        if (unwatched[0]?.stories?.storyId) {
          setActiveStoryId(unwatched[0].stories.storyId);
        } else {
          setActiveStoryId('');
        }
      } catch (error) {
        console.error("Error fetching recents:", error);
        setRecents([]);
        setActiveStoryId('');
      } finally {
        setLoading(false);
      }
    };

    if (activeChild?.id) {
      fetchRecents();
    } else {
      setRecents([]);
      setActiveStoryId('');
    }
  }, [activeChild]);

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (recents[newIndex]?.stories?.storyId) {
      setActiveStoryId(recents[newIndex].stories.storyId);
      setActiveIndex(newIndex);
    }
  };

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    if (recents[index]?.stories?.storyId) {
      setActiveStoryId(recents[index].stories.storyId);
      setActiveIndex(index);
    }
  };

  const handleLeftArrow = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      if (recents[newIndex]?.stories?.storyId) {
        setActiveIndex(newIndex);
        setActiveStoryId(recents[newIndex].stories.storyId);
      }
    }
  };

  const handleRightArrow = () => {
    if (activeIndex < recents.length - 1) {
      const newIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      if (recents[newIndex]?.stories?.storyId) {
        setActiveIndex(newIndex);
        setActiveStoryId(recents[newIndex].stories.storyId);
      }
    }
  };

  const handlePlayButton = (storyId: string) => {
    if (!storyId) return;
    if (mode === "parent")
      router.push(`/(parent)/(listen)/listenStory?storyId=${storyId}`);
    else
      router.push(`/(kid)/(listen)/listenStory?storyId=${storyId}`);
  };

  function FromSec(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  return (
    <ThemedView>
      {loading ? (
        <ActivityIndicator
          color="#ffffff"
          style={{ zIndex: 999, marginVertical: 50 }}
        />
      ) : recents.length > 0 ? (
        <ThemedView style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={recents}
            keyExtractor={(_, idx) => idx.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <ThemedView style={styles.card}>
                <ThemedView style={{ paddingHorizontal: 16 }}>
                  <ThemedView style={styles.topCircle}>
                    <ThemedText style={styles.topCircleText}>
                      {index + 1}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={styles.adventureHeader}>
                    {item?.stories?.series || ""}
                  </ThemedText>
                  <ThemedText style={styles.mainTitle}>
                    {item?.stories?.storyTitle || ""}
                  </ThemedText>
                  <ThemedText style={styles.subtitle}>
                    {item?.stories?.descriptionParent || ""}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={{ width: "100%" }}>
                  <ThemedView style={styles.imageWrap}>
                    <Image
                      source={item?.stories?.featuredIllustration ? item.stories.featuredIllustration : require("@/assets/images/parent/sample-card-image.png")}
                      style={styles.cardImage}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => handlePlayButton(item?.stories?.storyId)}
                      disabled={!item?.stories?.storyId}
                    >
                      <IconPlay
                        width={90}
                        height={90}
                        style={styles.playIcon}
                      />
                    </TouchableOpacity>
                  </ThemedView>
                  <ThemedView style={styles.timeBar}>
                    <ThemedView style={{ width: "100%" }}>
                      <ThemedView style={styles.progressRow}>
                        <ThemedView
                          style={{
                            width: "90%",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <ThemedText style={styles.storyTime}>
                            {FromSec(item?.played ?? 0)}
                          </ThemedText>
                          <ThemedView style={styles.progressBarWrap}>
                            <ThemedView
                              style={[
                                styles.progressBarFilled,
                                {
                                  width: `${((item?.played ?? 0) * 100) /
                                    (item?.duration ?? 1)
                                    }%`,
                                },
                              ]}
                            />
                            <ThemedView
                              style={[
                                styles.progressBarOutline,
                                {
                                  width: `${100 -
                                    ((item?.played ?? 0) * 100) /
                                    (item?.duration ?? 1)
                                    }%`,
                                },
                              ]}
                            />
                          </ThemedView>
                          <ThemedText style={styles.storyTime}>
                            {FromSec(
                              (item?.duration ?? 0) - (item?.played ?? 0)
                            )}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            )}
          />
          {recents && recents.length > 1 &&
            <ThemedView style={styles.cardFooter}>
              <TouchableOpacity onPress={handleLeftArrow}>
                <IconArrowLeft
                  width={24}
                  height={24}
                  color={"white"}
                  style={styles.leftBtn}
                />
              </TouchableOpacity>
              <ThemedView style={styles.dotsWrap}>
                {recents.map((_, idx) => (
                  <TouchableOpacity key={idx} onPress={() => handleDotPress(idx)}>
                    <ThemedView
                      style={[
                        styles.dot,
                        activeIndex === idx && styles.dotActive,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ThemedView>
              <TouchableOpacity onPress={handleRightArrow}>
                <IconArrowRight
                  width={24}
                  height={24}
                  color={"white"}
                  style={styles.leftBtn}
                />
              </TouchableOpacity>
            </ThemedView>
          }
        </ThemedView>
      ) : (
        <ThemedView
          style={{
            flexDirection: "row",
            width: "100%",
            marginVertical: 30,
            justifyContent: "center",
          }}
        >
          <ThemedText style={{ color: "#ffffff7a" }}>
            {" "}
            no recent data{" "}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginTop: 20,
  },
  card: {
    width: width * 0.9,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgb(5, 59, 74)",
    borderColor: "rgba(252, 252, 252, 0.2)",
    paddingVertical: 24,
    alignItems: "center",
    marginHorizontal: 5,
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
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 33.6,
    fontStyle: "italic",
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: 400,
    lineHeight: 21.6,
    marginBottom: 50,
  },
  imageWrap: {
    width: "100%",
    height:  width / 2 * 1.4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: width / 2 * 1.4,
  },
  overlayBalloon: {
    position: "absolute",
    top: -32,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    zIndex: 2,
  },
  balloonIcon: {
    width: 60,
    height: 60,
  },
  playButton: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: -28 }],
    width: 90,
    height: 90,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  playIcon: {
    width: 90,
    height: 90,
    // opacity: 0.85
  },
  timeBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  timeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  timeButtonActive: {
    backgroundColor: "#AD D7DA",
  },
  timeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  timeBarWatched: {
    flex: 1,
    height: 12,
    backgroundColor: "rgba(248, 236, 174, 1)",
    borderRadius: 6,
    marginHorizontal: 8,
    position: "relative",
    overflow: "hidden",
  },
  timeBarRemain: {
    flex: 1,
    height: 12,
    backgroundColor: "white",
    borderRadius: 6,
    marginHorizontal: 8,
    position: "relative",
    overflow: "hidden",
  },
  dotsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "white",
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: "white",
  },
  cardFooter: {
    width: "80%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftBtn: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  rightBtn: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  storyTitle: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    fontStyle: "italic",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
    flexGrow: 1,
  },
  progressRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16,
    padding: 10,
    gap: 12,
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  storyTime: {
    fontSize: 16,
    color: '#fff',
    fontWeight: "400",
    lineHeight: 20,
  },
  progressBarWrap: {
    flexDirection: "row",
    width: '80%',
    height: 15,
    alignItems: "center",
    gap: 2,
  },
  progressBarFilled: {
    height: 15,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#F8ECAE",
    borderColor: "#fff",
  },
  progressBarOutline: {
    height: 15,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "transparent",
    borderColor: "#fff",
  },
});
