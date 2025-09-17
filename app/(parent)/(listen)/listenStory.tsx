import { getSeriesByStoryId } from "@/api/series";
import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import MediaPlayerCard from "@/components/MediaPlayerCard";
import { Finished } from "@/components/Modals";
import AdventureStoryCarousel from "@/components/StoryCarousel";
import { ThemedView } from "@/components/ThemedView";
import { modesData } from "@/data/parent/dashboardData";
import { useChildrenStore } from "@/store/childrenStore";
import { useListenStore } from "@/store/listenStore";
import { useSeriesStore } from "@/store/seriesStore";
import { useStoryStore } from "@/store/storyStore";
import { useTrackStore } from "@/store/trackStore";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import IconArrowLeft from "@/assets/images/icons/arrow-left.svg";
import IconMusic from "@/assets/images/icons/music.svg";
import StoryStyleModal from "@/components/Modals/StoryStyleModal";

export default function ListenStory() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const storyId = typeof params.storyId === "string" ? params.storyId : "";
  const currentStory = useStoryStore((state) => state.listeningStory);
  const setCurrentStory = useStoryStore((state) => state.setCurrentStory);
  const [loading, setLoading] = React.useState(false);
  const modes = modesData;
  const [modalVisible, setModalVisible] = React.useState(false);
  const { activeChild, setActiveChild } = useChildrenStore();
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const setSeries = useSeriesStore((state) => state.setSeries);
  const setStories = useStoryStore((state) => state.setStories);
  const stories = useStoryStore((state) => state.stories);
  const setActiveTrack = useTrackStore((state) => state.setActiveTrack);
  const [styleModalVisible, setStyleModalVisible] = React.useState(false);

  React.useEffect(() => {
    async function fetchSeries() {
      setLoading(true);
      try {
        if (!activeChild) {
          setLoading(false);
          return;
        }
        const data = await getSeriesByStoryId(storyId, activeChild.id);
        if (data) {
          // Save to listen store
          useListenStore.getState().setSeries(data.series);
          useListenStore.getState().setStories(data.stories);
          const index = data.stories.findIndex(
            (story: any) => story.storyId === storyId
          );
          useListenStore.getState().setCurrentIndex(index);
          // If you want to keep local state in sync as well:
          setCurrentCardIndex(index);
          setCurrentStory(data.stories[index]);
        }
      } catch (error) {
        console.error("Error fetching series:", error);
      } finally {
        setLoading(false);
      }
    }

    if (storyId) {
      fetchSeries();
    } else {
      setSeries([]);
      setStories([]);
    }
  }, [storyId]);

  const handleChildSelect = (child: any) => {
    setActiveChild(child);
  };

  const onNext = () => {
    setCurrentStory(stories[currentCardIndex + 1]);

    setCurrentCardIndex(currentCardIndex + 1);

    setModalVisible(false);
  };

  const onWatchAgain = async () => {
    // Reset watched and played for the current story in backend
    setActiveTrack({
      storyId: currentStory?.storyId || "",
      childId: activeChild?.id || "",
      played: 0,
      duration: currentStory?.track?.duration || 1,
      watched: false,
      audioUrl: currentStory ? currentStory.audio_s_2_5 : "",
      again: true,
    });
    setModalVisible(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, display: "flex", height: 500 }}>
        <ThemedView style={{ flex: 1, display: "flex", position: "relative" }}>
          <Modal
            transparent
            visible={styleModalVisible}
            animationType="fade"
            onRequestClose={() => setStyleModalVisible(false)}
          >
            <StoryStyleModal goBack={() => setStyleModalVisible(false)}/>
          </Modal>
          <ScrollView
            style={styles.rootContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 55 }}
          >
            {/* Top background */}
            <Image
              source={require("@/assets/images/parent/parent-back-pattern.png")}
              style={styles.topBackPattern}
              contentFit="cover"
            />

            {/* Main Content */}
            <Header role="parent" theme="dark" mode="listen"></Header>
            {/* Header */}

            <ThemedView style={styles.container}>
              {/* Dots */}
              <ThemedView style={styles.cardFooter}>
                <TouchableOpacity onPress={() => router.push("./")}>
                  <IconArrowLeft
                    color={"white"}
                    width={24}
                    height={24}
                    style={styles.leftBtn}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ position: 'relative', width: 32 }}
                  onPress={() => setStyleModalVisible(true)}
                >
                  <IconMusic width={24} height={24} style={styles.rightBtn} />
                  <ThemedView style={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderRadius: 50,
                    backgroundColor: '#ADD7DA',
                    zIndex: -1,
                    right: 0
                  }}></ThemedView>

                </TouchableOpacity>
              </ThemedView>

              <MediaPlayerCard
                onAudioEnd={() => setModalVisible(true)}
                activeChild={activeChild}
              />

              <AdventureStoryCarousel
                storyId={storyId}
                activeChild={activeChild}
              />
            </ThemedView>
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
            <BottomNavBar
              role="parent"
              active="Listen"
              theme="light"
              image={true}
            />
          </ThemedView>

          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <ThemedView style={styles.modalOverlay}>
              <Finished onNext={onNext} onWatchAgain={onWatchAgain} />
            </ThemedView>
          </Modal>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  cardFooter: {
    marginTop: 30,
    paddingHorizontal: 16,
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
  myText: {
    fontFamily: "Sintara-Bold",
    fontSize: 18,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: "rgba(5, 59, 74, 1)",
    position: "relative",
  },
  topBackPattern: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  container: {
    zIndex: 100,
    paddingBottom: 50,
    marginBottom: 50,
  },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 30,
    marginBottom: 30,
  },
  subTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 30,
    marginBottom: 20,
  },
  headingWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 23,
  },
  logoBallon: { width: 36, height: 36 },
  logoParent: { width: 48, height: 48 },
  logodown: { width: 24, height: 24 },
  headerWrap: {
    marginTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
  },
  headerStar: {
    width: 32,
    height: 34,
    marginLeft: 8,
  },
  headerSubtitle: {
    color: "#053B4A",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 24.3,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  headerRocket: { width: 74.68, height: 130.21, zIndex: -1 },
  headerRocketWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    zIndex: -1,
  },
  imgCloudFar: {
    width: 427,
    height: 200,
    position: "absolute",
    top: 0,
    left: -37.5,
    zIndex: -100,
  },
  imgCloudNear: {
    width: 427,
    height: 220,
    position: "absolute",
    top: 37,
    left: -20,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
  },
  sectionTitle: {
    fontFamily: "Sintara-Bold",
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectionArrow: {
    width: 24,
    height: 24,
  },
  cardScrollContainer: {
    gap: 20,
    paddingBottom: 60,
  },
  insightItem: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 15,
    borderWidth: 1, // Thickness of the border
    borderColor: "rgba(252, 252, 252, 0.2)",
    borderStyle: "solid",
    borderRadius: 20,
  },
  itemValue: {
    fontSize: 24,
    color: "rgba(252, 252, 252, 1)",
    fontWeight: 700,
  },
  itemWhat: {
    fontSize: 14,
    fontWeight: 400,
    color: "rgba(122, 193, 198, 1)",
  },
  insightStyles: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  modesStyle: {
    marginTop: 20,
    marginBottom: 60,
    marginHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  modeItemStyle: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
