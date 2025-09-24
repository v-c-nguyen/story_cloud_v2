
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useRouter } from "expo-router";
import supabase from "@/app/lib/supabase";
import { useChildrenStore } from "@/store/childrenStore";
import { useFavoritesStore } from "@/store/favoritesStore";

import IconFilledBallon from "@/assets/images/icons/FilledBallon.svg"
import IconPlus from "@/assets/images/parent/icon-plus.svg";
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconHeart from "@/assets/images/parent/footer/icon-heart.svg"
import IconPlay from "@/assets/images/icons/play.svg"
import GradientText from "./ui/GradientText";
import IconCheck from "@/assets/images/parent/icon-check.svg"
import AddPathwahModal from "./Modals/AddPathwayModal";
import { Pathway, usePathwayStore } from "@/store/pathwayStore";

interface RecentProps {
  stories: {
    storyId: string;
    seriesCategory: string;
    series: string;
    storyTitle: string;
    featuredIllustration: string;
  };
  duration?: number;
  played?: number;
  watched?: boolean;
}

const cardStyles = [
  {
    bgColor: "rgb(5, 59, 74)",
    textColor: "#FCFCFC",
    subTextColor: "#F8ECAE",
    progressColor: "#F8ECAE",
    isBallonYellow: false,
    ballonColor2: "rgba(244, 166, 114, 1)",
    ballonColor3: "rgba(173, 215, 218, 1)",
  },
  {
    bgColor: "rgb(244, 166, 114)",
    textColor: "#053B4A",
    subTextColor: "#F8ECAE",
    progressColor: "#ADD7DA",
    isBallonYellow: false,
    ballonColor2: "rgba(255, 191, 191, 1)",
    ballonColor3: "rgba(223, 178, 255, 1)",
  },
  {
    bgColor: "rgb(248, 236, 174)",
    textColor: "#053B4A",
    subTextColor: "#048F99",
    progressColor: "#ADD7DA",
    isBallonYellow: false,
    ballonColor2: "rgba(255, 191, 191, 1)",
    ballonColor3: "rgba(223, 178, 255, 1)",
  },
  {
    bgColor: "#ADD7DA",
    textColor: "#053B4A",
    subTextColor: "rgba(4, 143, 153, 1)",
    progressColor: "#F8ECAE",
    isBallonYellow: true,
    ballonColor2: "rgba(255, 191, 191, 1)",
    ballonColor3: "rgba(223, 178, 255, 1)",
  },
];

// Story Card for the Recent items - Kid Mode

export function StoryCard({
  num,
  recent,
  onPlay,
}: {
  num: number;
  recent: RecentProps;
  onPlay?: (id: string) => void;
}) {
  // Use a consistent style based on the story index
  const styleIdx = num % cardStyles.length;
  const style = cardStyles[styleIdx];
  const [isFavorite, setIsFavorite] = useState(false)
  const favoritesStories = useFavoritesStore((s) => s.stories)
  const addStory = useFavoritesStore((s) => s.addStory)
  const removeStory = useFavoritesStore((s) => s.removeStory)

  useEffect(() => {
    const fav = favoritesStories.find((item) => item.story_id === recent.stories.storyId)
    if (fav) setIsFavorite(true)
    else setIsFavorite(false)
  }, [favoritesStories])

  function FromSec(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec}`;
  }

  function ToFavorites(id: string) {
    const child_id = useChildrenStore.getState().activeChild?.id;

    // Get the JWT token if needed for Authorization header
    supabase.auth.getSession().then((sessionResult) => {
      const jwt = sessionResult?.data?.session?.access_token;

      if (!isFavorite) {
        fetch("https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({ story_id: id, child_id: child_id, style: "story" }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || "Failed to add favorite");
            }
            return res.json();
          })
          .then((data) => {
            // Optionally update your local favorites store here
            addStory(data)
          })
          .catch((error) => {
            console.error("Failed to add favorite:", error);
          });
      }
      else {
        fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/favorites/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({ child_id: child_id, style: "story" }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || "Failed to remove favorite");
            }
            return res.json();
          })
          .then((data) => {
            // Optionally update your local favorites store here
            removeStory(data)
          })
          .catch((error) => {
            console.error("Failed to add favorite:", error);
          });
      }
    });
  }

  const imageGen = (img: string) => {
    switch (img) {
      case "1":
        return require("@/assets/images/kid/story-back-1.png");
      case "2":
        return require("@/assets/images/kid/story-back-2.png");
      case "3":
        return require("@/assets/images/kid/story-back-3.png");
      default:
        return null;
    }
  };
  return (
    <ThemedView style={[styles.storyCard, style.bgColor == "rgb(5, 59, 74)" && { borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)" }, { backgroundColor: style.bgColor }]}>
      <ThemedView>
        <ThemedView style={{ height: 180 }}>
          <ThemedView style={[styles.storyCardTopRow_track, { height: 50 }]}>
            <ThemedText
              style={[styles.storyNumber, { color: style.textColor }]}
            >
              #{num}
            </ThemedText>
            <ThemedText style={[styles.storyLabel, { color: style.textColor }]}>
              Story
            </ThemedText>
            <TouchableOpacity
              onPress={() => ToFavorites(recent.stories.storyId)}
              style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
              isFavorite && {
                backgroundColor: style.bgColor == "rgb(244, 166, 114)" ? "white" : "rgb(244, 166, 114)",
                borderRadius: 20, width: 20, height: 20
              }]}
            >
              {
                <IconHeart
                  width={20}
                  height={20}
                  color={`${style.textColor}`}
                />
              }
            </TouchableOpacity>
          </ThemedView>
          <ThemedText
            style={[styles.storySeries, { color: style.subTextColor }]}
          >
            {recent.stories.series}
          </ThemedText>
          <ThemedText style={[styles.storyTitle, { color: style.textColor }]}>
            {recent.stories.storyTitle}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.storyImageWrap}>
          <Image
            source={
              recent.stories.featuredIllustration
            }
            style={styles.storyImage}
          />
          <TouchableOpacity
            style={styles.storyPlayBtn}
            onPress={() => onPlay && onPlay(recent.stories.storyId)}
          >
            <IconPlay
              width={90}
              height={90}
              style={styles.storyPlayIcon}
            />
          </TouchableOpacity>
          <ThemedView
            style={{
              position: "absolute",
              width: 48,
              height: 48,
              backgroundColor: style.bgColor == "rgb(173, 215, 218)" ? "#F8ECAE" : "rgb(173, 215, 218)",
              top: -24,
              left: "50%",
              transform: "translate(-24px, 0)",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: 'center',
              borderRadius: 24,
            }}
          >
            <IconFilledBallon
              width={25}
              height={35}
            />
          </ThemedView>
        </ThemedView>
        <ThemedView>
          {recent.watched ? (
            <ThemedView style={styles.progressRow}>
              <IconCheck
                width={20}
                height={20}
                color={style.textColor}
              />
              <ThemedText
                style={[styles.storyTime, { color: style.textColor }]}
              >
                Watched
              </ThemedText>

              <ThemedView
                style={[
                  styles.progressBarFilled,
                  {
                    borderColor: style.textColor,
                    backgroundColor: style.progressColor,
                    flex: 1,
                  },
                ]}
              />
            </ThemedView>
          ) : (
            <ThemedView style={styles.progressRow}>
              <ThemedText
                style={[styles.storyTime, { color: style.textColor }]}
              >
                {FromSec(recent.played ?? 0)}
              </ThemedText>
              <ThemedView style={styles.progressBarWrap}>
                <ThemedView
                  style={[
                    styles.progressBarFilled,
                    {
                      borderColor: style.textColor,
                      backgroundColor: style.progressColor,
                      width: `${((recent.played ?? 0) * 100) / (recent.duration ?? 1)
                        }%`,
                    },
                  ]}
                />
                <ThemedView
                  style={[
                    styles.progressBarOutline,
                    {
                      borderColor: style.textColor,
                      backgroundColor: style.bgColor,
                      width: `${100 -
                        ((recent.played ?? 0) * 100) / (recent.duration ?? 1)
                        }%`,
                    },
                  ]}
                />
              </ThemedView>
              <ThemedText
                style={[styles.storyTime, { color: style.textColor }]}
              >
                {FromSec((recent.duration ?? 0) - (recent.played ?? 0))}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

// Story Card for the Kid mode

interface StoryCard3Props {
  storyId: string;
  series: string;
  storyTitle: string;
  featuredIllustration?: string;
  isFavourite?: boolean;
  track?: {
    duration?: number;
    played?: number;
    watched?: boolean;
  };
}
export function StoryCard3({
  num,
  story,
  onPlay,
}: {
  num: number;
  story: StoryCard3Props;
  onPlay?: (id: string) => void;
}) {
  const [isFavorite, setIsFavorite] = useState(false)
  const favoritesStories = useFavoritesStore((s) => s.stories)
  const addStory = useFavoritesStore((s) => s.addStory)
  const removeStory = useFavoritesStore((s) => s.removeStory)
  // Use a consistent style based on the story index
  const styleIdx = num % cardStyles.length;
  const style = cardStyles[styleIdx];

  useEffect(() => {
    const fav = favoritesStories.find((item) => item.storyId == story.storyId)
    if (fav) setIsFavorite(true)
    else setIsFavorite(false)
  }, [favoritesStories])

  function FromSec(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec}`;
  }

  function ToFavorites(id: string) {
    const child_id = useChildrenStore.getState().activeChild?.id;

    // Get the JWT token if needed for Authorization header
    supabase.auth.getSession().then((sessionResult) => {
      const jwt = sessionResult?.data?.session?.access_token;

      if (!isFavorite) {
        fetch("https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({ story_id: id, child_id: child_id, style: "story" }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || "Failed to add favorite");
            }
            return res.json();
          })
          .then((data) => {
            // Optionally update your local favorites store here
            addStory(data)
          })
          .catch((error) => {
            console.error("Failed to add favorite:", error);
          });
      }
      else {
        fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/favorites/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({ child_id: child_id, style: "story" }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || "Failed to remove favorite");
            }
            return res.json();
          })
          .then((data) => {
            // Optionally update your local favorites store here
            removeStory(data)
          })
          .catch((error) => {
            console.error("Failed to add favorite:", error);
          });
      }
    });
  }
  const imageGen = (img: string) => {
    switch (img) {
      case "1":
        return require("@/assets/images/kid/story-back-1.png");
      case "2":
        return require("@/assets/images/kid/story-back-2.png");
      case "3":
        return require("@/assets/images/kid/story-back-3.png");
      default:
        return null;
    }
  };
  return (
    <ThemedView style={[styles.storyCard, style.bgColor == "rgb(5, 59, 74)" && { borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)" }, { backgroundColor: style.bgColor }]}>
      <ThemedView>
        <ThemedView style={{ height: 180 }}>
          <ThemedView style={[styles.storyCardTopRow, { height: 50 }]}>
            <ThemedText
              style={[styles.storyNumber, { color: style.textColor }]}
            >
              #{num}
            </ThemedText>
            <ThemedText style={[styles.storyLabel, { color: style.textColor }]}>
              Story
            </ThemedText>

            <TouchableOpacity
              onPress={() => ToFavorites(story.storyId)}
              style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
              isFavorite && {
                backgroundColor: style.bgColor == "rgb(244, 166, 114)" ? "white" : "rgb(244, 166, 114)",
                borderRadius: 20, width: 20, height: 20
              }]}
            >
              {
                <IconHeart
                  width={20}
                  height={20}
                  color={`${style.textColor}`}
                />
              }
            </TouchableOpacity>
          </ThemedView>
          <ThemedText
            style={[styles.storySeries, { color: style.subTextColor }]}
          >
            {story.series}
          </ThemedText>
          <ThemedText style={[styles.storyTitle, { color: style.textColor }]}>
            {story.storyTitle}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.storyImageWrap}>
          <Image
            source={
              story.featuredIllustration
                ? story.featuredIllustration
                : require("@/assets/images/kid/story-back-1.png")
            }
            style={styles.storyImage}
          />
          <TouchableOpacity
            style={styles.storyPlayBtn}
            onPress={() => onPlay && onPlay(story.storyId)}
          >
            <IconPlay
              width={90}
              height={90}
            />
          </TouchableOpacity>
          <ThemedView
            style={{
              position: "absolute",
              width: 48,
              height: 48,
              backgroundColor: style.bgColor == "rgb(173, 215, 218)" ? "#F8ECAE" : "rgb(173, 215, 218)",
              top: -24,
              left: "50%",
              transform: "translate(-24px, 0)",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: 'center',
              borderRadius: 24,
            }}
          >
            <IconFilledBallon
              width={25.3}
              height={35.12}
            />
          </ThemedView>
        </ThemedView>
        {story.track && (
          <ThemedView>
            {story.track.watched ? (
              <ThemedView style={styles.progressRow}>
                <IconCheck
                  width={20}
                  height={20}
                  color={style.textColor}
                />
                <ThemedText
                  style={[styles.storyTime, { color: style.textColor }]}
                >
                  Watched
                </ThemedText>

                <ThemedView
                  style={[
                    styles.progressBarFilled,
                    {
                      borderColor: style.textColor,
                      backgroundColor: style.progressColor,
                      flex: 1,
                    },
                  ]}
                />
              </ThemedView>
            ) : (
              <ThemedView style={styles.progressRow}>
                <ThemedText
                  style={[styles.storyTime, { color: style.textColor }]}
                >
                  {FromSec(story.track.played ?? 0)}
                </ThemedText>
                <ThemedView style={styles.progressBarWrap}>
                  <ThemedView
                    style={[
                      styles.progressBarFilled,
                      {
                        borderColor: style.textColor,
                        backgroundColor: style.progressColor,
                        width: `${((story.track.played ?? 0) * 100) /
                          (story.track.duration ?? 1)
                          }%`,
                      },
                    ]}
                  />
                  <ThemedView
                    style={[
                      styles.progressBarOutline,
                      {
                        borderColor: style.textColor,
                        backgroundColor: style.bgColor,
                        width: `${100 -
                          ((story.track.played ?? 0) * 100) /
                          (story.track.duration ?? 1)
                          }%`,
                      },
                    ]}
                  />
                </ThemedView>
                <ThemedText
                  style={[styles.storyTime, { color: style.textColor }]}
                >
                  {FromSec(
                    (story.track.duration ?? 0) - (story.track.played ?? 0)
                  )}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

// Story Card for the Parent mode
interface StoryProps1 {
  storyId: string;
  storyTitle: string;
  series: string;
  descriptionParent?: string;
  learning_categories?: any;
  featuredIllustration?: string;
  featured?: boolean;
  isFavourite?: boolean;
}

const images = [
  require("@/assets/images/kid/story-back-1.png"),
  require("@/assets/images/kid/story-back-2.png"),
  require("@/assets/images/kid/story-back-3.png"),
];
export function StoryCard1({
  num,
  story,
  onPlay,
}: {
  num: number;
  story: StoryProps1;
  onPlay?: (id: string) => void;
}) {
  // Use a consistent style based on the story index
  const router = useRouter();
  const [showAddStoryModal, setShowAddStoryModal] = React.useState(false)
  const scrollRef = React.useRef<ScrollView>(null);
  const styleIdx = num % cardStyles.length;
  const style = cardStyles[styleIdx];
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const currentPathway = usePathwayStore((s) => s.currentPathway)

  // In your handler:
  const handleLeftArrow = () => {
    if (currentCardIndex > 0) {
      scrollRef.current?.scrollTo({
        x: 290 * (currentCardIndex - 1),
        animated: true,
      });
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleRightArrow = () => {
    if (currentCardIndex < 2) {
      scrollRef.current?.scrollTo({
        x: 290 * (currentCardIndex + 1),
        animated: true,
      });
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleDotPress = (idx: number) => {
    if (idx >= 0) {
      scrollRef.current?.scrollTo({ x: 290 * idx, animated: true });
    }
    setCurrentCardIndex(idx);
  };

  const handlePlusButton = () => {
    if (currentPathway) {
      handleAddStory(currentPathway.id)
    } else {
      setShowAddStoryModal(true)
    }
  }

  async function handleAddStory(id: number) {
    const payload = {
      id: id,
      story: story.storyId
    }
    console.log(payload)
    try {
      const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
      const response = await fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/pathway-modes/addStory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwt ? `Bearer ${jwt}` : ''
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json();
      if (!response.ok) {
        return;
      }
      Alert.alert('New story added successfully');
    } catch (error) {
      Alert.alert('Fail to add new story');
      return;
    }
    setShowAddStoryModal(false)
  }

  return (
    <ThemedView style={[styles.storyCard, style.bgColor == "rgb(5, 59, 74)" && { borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)" }, { backgroundColor: style.bgColor }]}>
      <AddPathwahModal
        showAddStoryModal={showAddStoryModal}
        setShowAddStoryModal={setShowAddStoryModal}
        handleAddStory={handleAddStory}
      />
      <TouchableOpacity
        onPress={() =>
          router.push(`/(parent)/(learning)/(library)/storyDetail?id=${story.storyId}`)
        }
      >
        <ThemedView>
          <ThemedView style={{ height: 50 }}>
            {/* StoryCard Header */}
            <ThemedView
              style={[
                styles.storyCardTopRow,
                { position: "relative", overflow: "visible" },
              ]}
            >
              {currentCardIndex != 0 && (
                <ThemedView
                  style={[
                    styles.ballonStyle,
                    {
                      backgroundColor:
                        currentCardIndex == 1
                          ? style.ballonColor2
                          : style.ballonColor3,
                      zIndex: 999,
                    },
                  ]}
                >
                  <IconFilledBallon
                    style={{ width: 25, height: 35 }}
                  />
                </ThemedView>
              )}
              <ThemedText
                style={[styles.storyNumber, { color: style.textColor }]}
              >
                #{num}
              </ThemedText>
              {currentCardIndex == 0 && (
                <ThemedText
                  style={[styles.storyLabel, { color: style.textColor }]}
                >
                  Story
                </ThemedText>
              )}
              <TouchableOpacity
                onPress={() => handlePlusButton()}>
                <IconPlus
                  width={18}
                  height={18}
                  color={style.bgColor == "rgb(5, 59, 74)" ? "white" : "#053B4A"}
                  style={[
                    styles.storyFavIcon,
                  ]}
                />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          <ThemedView
            style={{
              height: 330,
              flexDirection: "row",
            }}
          >
            <ScrollView
              ref={scrollRef}
              horizontal
              style={styles.contentSeries}
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const x = event.nativeEvent.contentOffset.x;
                const cardWidth = 290 + 25; // card width + gap (adjust if needed)
                const index = Math.round(x / cardWidth);
                setCurrentCardIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {/* StoryCard Content 1 */}
              <ThemedView style={{ width: 290 }}>
                <ThemedView style={{ height: 120 }}>
                  {/* SeriesCategory */}
                  <ThemedText
                    style={[styles.storySeries, { color: style.subTextColor }]}
                  >
                    {story.series}
                  </ThemedText>
                  {/* Story Title */}
                  <ThemedText
                    style={[styles.storyTitle, { color: style.textColor }]}
                  >
                    {story.storyTitle}
                  </ThemedText>
                </ThemedView>
                {/* Story Image */}
                <ThemedView style={[styles.storyImageWrap, { height: 210 }]}>
                  <Image
                    source={story.featuredIllustration}
                    style={styles.storyImage}
                  />
                  {/* <Image source={story.image ? imageGen(story.image) : imageGen("1")} style={[styles.storyImage, { position: 'relative', zIndex: 4 }]} /> */}
                  <TouchableOpacity
                    style={styles.storyPlayBtn}
                    onPress={() => onPlay && onPlay(story.storyId)}
                  >
                    <IconPlay
                      width={60}
                      height={60}
                      style={styles.storyPlayIcon}
                    />
                  </TouchableOpacity>
                  <ThemedView
                    style={[
                      styles.ballonStyle0,
                      {
                        backgroundColor: style.isBallonYellow
                          ? "rgba(248, 236, 174, 1)"
                          : "rgba(173, 215, 218, 1)",
                      },
                    ]}
                  >
                    <IconFilledBallon
                      style={{ width: 25, height: 35 }}
                    />
                  </ThemedView>
                </ThemedView>
              </ThemedView>

              {/* StoryCard Content 2 */}
              <ThemedView style={{ width: 290, position: "relative" }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.cardContent,
                    {
                      position: "relative",
                      width: "100%",
                      minHeight: 330,
                      paddingBottom: 20,
                      backgroundColor: style.bgColor,
                      zIndex: 1,
                      flexDirection: "column",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    source={story.featuredIllustration}
                    style={styles.cardImage}
                  ></Image>
                  <ThemedText
                    style={[
                      styles.descriptionTitle,
                      {
                        color:
                          style.bgColor == "rgb(5, 59, 74)"
                            ? "rgba(248, 236, 174, 1)"
                            : "#053B4A",
                      },
                    ]}
                  >
                    Description
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.descriptionText,
                      {
                        color:
                          style.bgColor == "rgb(5, 59, 74)"
                            ? "rgba(255, 255, 255, 1)"
                            : "#053B4A",
                      },
                    ]}
                  >
                    {story.descriptionParent}
                  </ThemedText>

                </ScrollView>

              </ThemedView>

              {/* StoryCard Content 3 */}
              <ThemedView style={{ width: 290, position: "relative" }}>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.cardContent,
                    {
                      position: "relative",
                      width: "100%",
                      minHeight: 330,
                      paddingBottom: 20,
                      backgroundColor: style.bgColor,
                      zIndex: 1,
                      flexDirection: "column",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    source={story.featuredIllustration}
                    style={styles.cardImage}
                  ></Image>
                  <ThemedText
                    style={[
                      styles.descriptionTitle,
                      {
                        color:
                          style.bgColor == "rgb(5, 59, 74)"
                            ? "rgba(248, 236, 174, 1)"
                            : "#053B4A",
                      },
                    ]}
                  >
                    Learning Targets
                  </ThemedText>
                  <ThemedView style={{ flexDirection: "column", gap: 10 }}>
                    {story.learning_categories &&
                      story.learning_categories.length > 0 &&
                      story.learning_categories.map(
                        (item: string, index: number) => (
                          <ThemedView
                            key={index}
                            style={[
                              styles.learningTarget,
                              {
                                borderColor:
                                  style.bgColor == "rgb(5, 59, 74)"
                                    ? "rgba(255, 255, 255, 1)"
                                    : "#053B4A",
                              },
                            ]}
                          >
                            <ThemedText
                              key={index}
                              style={[
                                styles.descriptionText,
                                {
                                  fontWeight: 700,
                                  color:
                                    style.bgColor == "rgb(5, 59, 74)"
                                      ? "rgba(255, 255, 255, 1)"
                                      : "#053B4A",
                                },
                              ]}
                            >
                              {item}
                            </ThemedText>
                          </ThemedView>
                        )
                      )}
                  </ThemedView>
                </ScrollView>
              </ThemedView>
            </ScrollView>
          </ThemedView>
          <ThemedView>
            <ThemedView
              style={[styles.progressRow, { justifyContent: "space-around" }]}
            >
              {/* Dots */}
              <TouchableOpacity onPress={handleLeftArrow}>
                <IconArrowLeft
                  width={24}
                  height={24}
                  color={style.bgColor == "rgb(5, 59, 74)" ? "white" : "#053B4A"}
                  style={styles.leftBtn}
                />
              </TouchableOpacity>
              <ThemedView style={styles.dotsWrap}>
                {images.map((_, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleDotPress(idx)}
                  >
                    <ThemedView
                      style={[
                        styles.dot,
                        currentCardIndex === idx && styles.dotActive,
                        style.bgColor == "rgb(5, 59, 74)" && { borderColor: "white" },
                        style.bgColor == "rgb(5, 59, 74)" &&
                        currentCardIndex === idx && {
                          backgroundColor: "white",
                        },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ThemedView>
              <TouchableOpacity onPress={handleRightArrow}>
                <IconArrowRight
                  width={24}
                  height={24}
                  color={style.bgColor == "rgb(5, 59, 74)" ? "white" : "#053B4A"}
                  style={styles.leftBtn}
                />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}

// Story Card for the Demo version

interface StoryProps2 {
  bgColor: string;
  textColor: string;
  subTextColor: string;
  progressColor: string;
  isBallonYellow: boolean;
  number: string;
  storyTitle: string;
  seriesTitle: string;
  duration: number;
  progress: number;
  image: string;
  featured: boolean;
  isFavorite: boolean;
  watched: boolean;
}

export function StoryCard2({
  bgColor,
  textColor,
  subTextColor,
  progressColor,
  isBallonYellow,
  number,
  storyTitle,
  seriesTitle,
  duration,
  progress,
  image,
  featured,
  isFavorite,
  watched,
}: StoryProps2) {
  const imageGen = (img: string) => {
    switch (img) {
      case "1":
        return require("@/assets/images/kid/story-back-1.png");
      case "2":
        return require("@/assets/images/kid/story-back-2.png");
      case "3":
        return require("@/assets/images/kid/story-back-3.png");
      default:
        return null;
    }
  };
  return (
    <ThemedView style={[styles.storyCard2, { backgroundColor: bgColor }]}>
      <ThemedView style={[styles.storyCardTopRow, { height: 50 }]}>
        <ThemedText style={[styles.storyNumber, { color: textColor }]}>
          #{number}
        </ThemedText>
        <ThemedText style={[styles.storyLabel, { color: textColor }]}>
          Story
        </ThemedText>
        {

          <IconHeart
            width={20}
            height={20}
            color={`${textColor}`}
            style={[styles.storyFavIcon]}
          />

        }
      </ThemedView>
      <ThemedText style={[styles.storySeries, { color: subTextColor }]}>
        {seriesTitle}
      </ThemedText>
      <ThemedText style={[styles.storyTitle2, { color: textColor }]}>
        {storyTitle}
      </ThemedText>
      <ThemedView style={styles.storyImageWrap}>
        {image && <Image source={imageGen(image)} style={styles.storyImage} />}
        <TouchableOpacity style={styles.storyPlayBtn}>
          <IconPlay
            width={90}
            height={90}
          />
        </TouchableOpacity>
        <ThemedView
          style={{
            position: "absolute",
            width: 48,
            height: 48,
            backgroundColor: subTextColor,
            top: -24,
            left: "50%",
            transform: "translate(-24px, 0)",
            borderRadius: 24,
          }}
        >
          <IconFilledBallon
            width={48}
            height={48}
          />
        </ThemedView>
      </ThemedView>
      {watched ? (
        <ThemedView style={styles.progressRow}>
          <IconCheck
            width={20}
            height={20}
            color={textColor}
          />
          <ThemedText style={[styles.storyTime, { color: textColor }]}>
            Watched
          </ThemedText>

          <ThemedView
            style={[
              styles.progressBarFilled,
              {
                borderColor: textColor,
                backgroundColor: progressColor,
                flex: 1,
              },
            ]}
          />
        </ThemedView>
      ) : (
        <ThemedView style={styles.progressRow}>
          <ThemedText style={[styles.storyTime, { color: textColor }]}>
            {progress} min
          </ThemedText>
          <ThemedView style={styles.progressBarWrap}>
            <ThemedView
              style={[
                styles.progressBarFilled,
                {
                  borderColor: textColor,
                  backgroundColor: progressColor,
                  width: `${(progress * 100) / duration}%`,
                },
              ]}
            />
            <ThemedView
              style={[
                styles.progressBarOutline,
                {
                  borderColor: textColor,
                  backgroundColor: bgColor,
                  width: `${100 - (progress * 100) / duration}%`,
                },
              ]}
            />
          </ThemedView>
          <ThemedText style={[styles.storyTime, { color: textColor }]}>
            {duration - progress} min
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

// Series Card for the Demo version

interface SeriesInterface {
  title: string;
  count: number;
  image: string;
  isFavorite: boolean;
}

export function SeriesCard({
  title,
  count,
  image,
  isFavorite,
}: SeriesInterface) {
  const imageGen = (img: string) => {
    switch (img) {
      case "1":
        return require("@/assets/images/kid/series-back-1.png");
      case "2":
        return require("@/assets/images/kid/series-back-2.png");
      case "3":
        return require("@/assets/images/kid/series-back-3.png");
      case "4":
        return require("@/assets/images/kid/series-back-4.png");
      case "5":
        return require("@/assets/images/kid/series-back-5.png");
      default:
        return null;
    }
  };
  return (
    <ThemedView style={styles.seriesCard}>
      <ThemedView style={styles.favActiveCircle}></ThemedView>
      {isFavorite && (
        <IconHeart
          width={20}
          height={20}
          style={[
            styles.storyFavIcon,
            { position: "absolute", top: 20, right: 22 },
          ]}
        />
      )}
      <ThemedText style={styles.seriesLabel}>Series</ThemedText>

      <ThemedText style={styles.seriesTitle}>{title}</ThemedText>
      <Image source={imageGen(image)} style={styles.seriesImage} />
      <ThemedText style={styles.seriesCount}>{count} Stories</ThemedText>
    </ThemedView>
  );
}

// Series Card for the Kid Mode

interface SeriesInterface2 {
  name: string;
  episode_count: number;
  image: string;
  isFavorite: boolean;
}

export function SeriesCard2({
  name,
  episode_count,
  image,
  isFavorite,
}: SeriesInterface2) {
  const imageGen = (img: string) => {
    switch (img) {
      case "1":
        return require("@/assets/images/kid/series-back-1.png");
      case "2":
        return require("@/assets/images/kid/series-back-2.png");
      case "3":
        return require("@/assets/images/kid/series-back-3.png");
      case "4":
        return require("@/assets/images/kid/series-back-4.png");
      case "5":
        return require("@/assets/images/kid/series-back-5.png");
      default:
        return null;
    }
  };
  return (
    <ThemedView style={styles.seriesCard}>
      <ThemedView style={styles.favActiveCircle}></ThemedView>
      {isFavorite && (
        <IconHeart
          width={20}
          height={20}
          style={[
            styles.storyFavIcon,
            { position: "absolute", top: 20, right: 22 },
          ]}
        />
      )}
      <ThemedText style={styles.seriesLabel}>Series</ThemedText>

      <ThemedText style={styles.seriesTitle}>{name}</ThemedText>
      <Image source={imageGen("1")} style={styles.seriesImage} />
      <ThemedText style={styles.seriesCount}>
        {episode_count} Stories
      </ThemedText>
    </ThemedView>
  );
}

// Story Card for the Parent mode

interface SeriesCardParentProps {
  id: string;
  name: string;
  episode_count: number;
  series_category: string;
  description_parent?: string;
  learning_category?: any;
  featuredIllustration: string;
  isFavourite?: boolean;
}
export function SeriesCard_Parent({
  series,
}: {
  series: SeriesCardParentProps;
}) {
  // Use a consistent style based on the story index
  const [activeIndex, setActiveIndex] = React.useState(0);
  const ViewRef = useRef<View>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const router = useRouter();

  const handleLeftArrow = () => {
    if (currentCardIndex > 0) {
      scrollRef.current?.scrollTo({
        x: 290 * (currentCardIndex - 1),
        animated: true,
      });
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleRightArrow = () => {
    if (currentCardIndex < 2) {
      scrollRef.current?.scrollTo({
        x: 290 * (currentCardIndex + 1),
        animated: true,
      });
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleDotPress = (idx: number) => {
    if (idx >= 0) {
      scrollRef.current?.scrollTo({ x: 290 * idx, animated: true });
    }
    setCurrentCardIndex(idx);
  };

  return (
    <ThemedView
      style={[
        styles.storyCard,
        {
          height: 420,
          backgroundColor: "#053B4A",
          borderColor: "#add7da36",
          borderWidth: 1,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          router.push(`/(parent)/(learning)/(library)/seriesDetail?id=${series.id}`)
        }
      >
        <ThemedView>
          <ThemedView style={{ height: 50 }}>
            {/* SeriesCard Header */}
            <ThemedView
              style={[
                styles.storyCardTopRow,
                { position: "relative", overflow: "visible" },
              ]}
            >
              {currentCardIndex != 0 && (
                <ThemedView
                  style={[
                    styles.ballonStyle,
                    {
                      backgroundColor:
                        currentCardIndex == 1
                          ? cardStyles[0].ballonColor2
                          : cardStyles[0].ballonColor3,
                      zIndex: 999,
                    },
                  ]}
                >
                  <IconFilledBallon
                    width={25.3}
                    height={35.12}
                  />
                </ThemedView>
              )}
              <ThemedText
                style={[styles.storyNumber, { color: "rgba(5, 59, 74, 1)" }]}
              >
                #
              </ThemedText>
              {currentCardIndex == 0 && (
                <ThemedText style={[styles.storyLabel, { color: "white" }]}>
                  Series
                </ThemedText>
              )}
              <TouchableOpacity>
                <IconPlus
                  color={"white"}
                  width={20}
                  height={20}
                  style={[styles.storyFavIcon]}
                />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          <ThemedView
            style={{
              height: 330,
              flexDirection: "row",
            }}
          >
            <ScrollView
              ref={scrollRef}
              horizontal
              style={styles.contentSeries}
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const x = event.nativeEvent.contentOffset.x;
                const cardWidth = 290 + 25; // card width + gap (adjust if needed)
                const index = Math.round(x / cardWidth);
                setCurrentCardIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {/* Series Card Content 1 */}
              <ThemedView style={{ width: 290 }}>
                <ThemedView style={{ height: 100 }}>
                  {/* SeriesCategory */}
                  <ThemedView style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <ThemedText
                      style={[
                        styles.storySeries,
                        { color: "rgba(4, 143, 153, 1)", marginBottom: 5 },
                      ]}
                    >
                      <GradientText text={series.name} ></GradientText>
                    </ThemedText>
                    {/* Story Title */}
                    <ThemedText style={[styles.storyLabel, { textAlign: "center", color: "white" }]}>
                      {series.episode_count} Stories
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                {/* Story Image */}
                <ThemedView style={[styles.storyImageWrap, { height: 230 }]}>
                  {/* Render a series of 3 background images */}
                  <View
                    ref={ViewRef}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Image
                      source={series.featuredIllustration}
                      style={styles.seriesImage}
                    />
                  </View>
                </ThemedView>
              </ThemedView>

              {/* StoryCard Content 2 */}
              <ThemedView style={{ width: 290, position: "relative" }}>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.cardContent,
                    {
                      position: "relative",
                      width: "100%",
                      minHeight: 330,
                      paddingBottom: 20,
                      backgroundColor: "#053B4A",
                      zIndex: 1,
                      flexDirection: "column",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    source={series.featuredIllustration}
                    style={styles.cardImage}
                  ></Image>
                  <ThemedText
                    style={[
                      styles.descriptionTitle,
                      {
                        color: "rgba(248, 236, 174, 1)",
                      },
                    ]}
                  >
                    Description
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.descriptionText,
                      {
                        color: "rgba(255, 255, 255, 1)",
                      },
                    ]}
                  >
                    {series.description_parent}
                  </ThemedText>
                </ScrollView>
              </ThemedView>

              {/* StoryCard Content 3 */}
              <ThemedView style={{ width: 290, position: "relative" }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.cardContent,
                    {
                      position: "relative",
                      width: "100%",
                      paddingBottom: 20,
                      minHeight: 330,
                      backgroundColor: "#053B4A",
                      zIndex: 1,
                      flexDirection: "column",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Image
                    source={series.featuredIllustration}
                    style={styles.cardImage}
                  ></Image>
                  <ThemedText
                    style={[
                      styles.descriptionTitle,
                      {
                        color: "rgba(248, 236, 174, 1)",
                      },
                    ]}
                  >
                    Learning Targets
                  </ThemedText>
                  <ThemedView style={{ flexDirection: "column", gap: 10 }}>
                    {series.learning_category &&
                      series.learning_category.length > 0 &&
                      series.learning_category.map(
                        (item: string, index: number) => (
                          <ThemedView
                            key={index}
                            style={[
                              styles.learningTarget,
                              {
                                borderColor: "rgba(255, 255, 255, 1)",
                              },
                            ]}
                          >
                            <ThemedText
                              key={index}
                              style={[
                                styles.descriptionText,
                                {
                                  color: "rgba(255, 255, 255, 1)",
                                  fontWeight: 700
                                },
                              ]}
                            >
                              {item}
                            </ThemedText>
                          </ThemedView>
                        )
                      )}
                  </ThemedView>
                </ScrollView>
              </ThemedView>
            </ScrollView>
          </ThemedView>
          <ThemedView style={{ height: 40 }}>
            <ThemedView
              style={[styles.progressRow, { justifyContent: "space-around" }]}
            >
              {/* Dots */}
              <TouchableOpacity onPress={handleLeftArrow}>
                <IconArrowLeft
                  color={"white"}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
              <ThemedView style={styles.dotsWrap}>
                {images.map((_, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleDotPress(idx)}
                  >
                    <ThemedView
                      style={[
                        styles.dot,
                        currentCardIndex === idx && styles.dotActive,
                        { borderColor: "white" },
                        currentCardIndex === idx && {
                          backgroundColor: "white",
                        },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ThemedView>
              <TouchableOpacity onPress={handleRightArrow}>
                <IconArrowRight
                  color={"white"}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Card styles for StoryCard and SeriesCard
  storyCard: {
    overflow: 'hidden',
    width: 290,
    borderRadius: 10,
    padding: 0,
    marginHorizontal: 5,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    marginBottom: 8,
    position: "relative",
    display: "flex",
  },
  storyCard2: {
    width: 290,
    borderRadius: 10,
    padding: 0,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    marginBottom: 8,
    position: "relative",
    display: "flex",
  },
  storyCardTopRow: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "space-between",
  },
  storyCardTopRow_track: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "space-between",
  },
  storyNumber: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 30,
  },
  storyLabel: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  storyFavIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
  },
  ballonStyle: {
    position: "absolute",
    width: 48,
    height: 48,
    bottom: -24,
    left: "50%",
    borderRadius: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  ballonStyle0: {
    position: "absolute",
    width: 48,
    height: 48,
    top: -24,
    left: "50%",
    transform: "translate(-24px, 0)",
    borderRadius: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  storySeries: {
    color: "#F8ECAE",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  storyImageWrap: {
    position: "relative",
  },
  storyImage: {
    width: "100%",
    height: 210,
    backgroundColor: "#eee",
  },
  storyPlayBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -32,
    marginTop: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  storyPlayIcon: {
    width: 90,
    height: 90,
  },
  contentSeries: {},
  learningTarget: {
    borderWidth: 1,
    borderRadius: 70,
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 30,
    marginBottom: 15,
    textAlign: "center",
  },
  descriptionText: {
    color: "#053B4A",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18.9,
    fontWeight: 400,
  },
  cardContent: {
    paddingHorizontal: 16,
  },
  categoryPillsContainer: {
    paddingHorizontal: 16,
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

  storyTitle2: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    fontStyle: "italic",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
    flexGrow: 1,
    marginBottom: 30,
  },
  cardImage: {
    position: "absolute",
    opacity: 0.3,
    top: 0,
    left: 0,
    width: "115%",
    height: "115%",
    resizeMode: "cover",
  },
  progressRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "400",
    lineHeight: 20,
  },
  progressBarWrap: {
    width: 150,
    flexDirection: "row",
    height: 15,
    alignItems: "center",
    gap: 2,
  },
  progressBarFilled: {
    height: 15,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#ADD7DA",
    borderColor: "#053B4A",
  },
  progressBarOutline: {
    height: 15,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "transparent",
    borderColor: "#053B4A",
  },
  seriesCard: {
    width: 290,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: "#FCFCFC",
    borderWidth: 1,
    borderColor: "#ADD7DA",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: "flex-start",
    marginBottom: 8,
    position: "relative",
    display: "flex",
  },
  seriesLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#053B4A",
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 19,
    textAlign: "center",
  },
  seriesTitle: {
    flexGrow: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#048F99",
    textTransform: "uppercase",
    lineHeight: 24,
    marginBottom: 38,
    textAlign: "center",
  },
  seriesImage: {
    width: "100%",
    height: 230,
    alignSelf: "center",
    backgroundColor: "#eee",
  },
  seriesCount: {
    fontSize: 16,
    color: "#053B4A",
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "center",
    marginVertical: 10,
  },
  favActiveCircle: {
    position: "absolute",
    width: 17,
    height: 17,
    top: 21,
    right: 20,
    backgroundColor: "#F4A672",
    borderRadius: 17,
  },
  leftBtn: {
    width: 20,
    height: 20
  },
  rightBtn: {
    width: 20,
    height: 20,
    marginBottom: 2,
    tintColor: "#053B4A",
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
    borderColor: "#053B4A",
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: "#053B4A",
  },
});
