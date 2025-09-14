import { useSeriesStore } from "@/store/seriesStore";
import { useStoryStore } from "@/store/storyStore";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { StoryCard3 } from "./Cards";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useListenStore } from "@/store/listenStore";
import IconCheck from "@/assets/images/parent/icon-check.svg"
const { width } = Dimensions.get("window");

export default function AdventureStoryCarousel({
  storyId,
  activeChild,
}: {
  storyId: string;
  activeChild: any;
}) {
  const stories = useListenStore((state) => state.stories);
  const currentIndex = useListenStore(state => state.currentIndex)

  const flatListRef = useRef<ScrollView>(null);

  return (
    <ThemedView style={styles.container}>
      {/* Progress bar */}
      <ThemedView style={styles.progressBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ThemedView style={styles.stepsRow}>
            {stories.map((story: any, idx: any) => {
              const isCompleted = story.track?.watched;
              const isActive = idx === currentIndex;
              return (
                <ThemedView
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <TouchableOpacity
                    style={styles.stepWrap}
                  >
                    <ThemedView
                      style={[
                        (isCompleted || isActive) && styles.highlightedBorder,
                      ]}
                    >
                      <ThemedView
                        style={[
                          isCompleted
                            ? styles.stepCircleCompleted
                            : isActive
                              ? styles.stepCircleActive
                              : styles.stepCircle,
                        ]}
                      >
                        {isCompleted ? (
                          <IconCheck
                            width={14}
                            height={14}
                            color={"#F4A672"}
                          />
                        ) : (
                          <ThemedText
                            style={
                              isActive
                                ? styles.stepNumberActive
                                : styles.stepNumber
                            }
                          >
                            {idx + 1}
                          </ThemedText>
                        )}
                      </ThemedView>
                    </ThemedView>
                  </TouchableOpacity>
                  {idx < stories.length - 1 && (
                    <ThemedView
                      style={[
                        styles.line,
                        isCompleted && styles.completeLine,
                        isActive && styles.activeLine,
                      ]}
                    />
                  )}
                </ThemedView>
              );
            })}
          </ThemedView>
        </ScrollView>
      </ThemedView>

      {/* Story Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        scrollEventThrottle={16}
        contentContainerStyle={styles.cardScrollContainer}
      >
        {stories.length > 0 &&
          stories.map((item: any, index: any) => (
            <StoryCard3 key={index} num={index + 1} story={item} />
          ))}
      </ScrollView>
    </ThemedView>
  );
}

const CARD_WIDTH = width * 0.85;

const styles = StyleSheet.create({
  cardScrollContainer: {
    gap: 20,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
  },
  progressBar: {
    paddingBottom: 5,
    paddingTop: 8,
    paddingLeft: 16,
    width: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignSelf: "center",
  },
  adventureHeader: {
    color: "#FFE7A0",
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 10,
    textAlign: "center",
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    justifyContent: "center",
    marginBottom: 6,
  },
  stepWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  highlightedBorder: {
    borderWidth: 7,
    borderColor: "rgba(252, 252, 252, 0.2)",
    borderRadius: 50,
  },
  stepCircleCompleted: {
    backgroundColor: "#F4A672",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    width: 24,
    height: 24,
  },
  stepCircleActive: {
    borderWidth: 2,
    borderColor: "#F4A672",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircle: {
    backgroundColor: "rgba(173, 215, 218, 1)",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: "rgba(5, 59, 74, 1)",
    fontWeight: 700,
    fontSize: 18,
  },
  stepNumberActive: {},
  stepLabel: {
    fontSize: 14,
    color: "#AD D7DA",
    marginTop: 2,
    textAlign: "center",
  },

  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: "#05415F",
    borderRadius: 18,
    paddingTop: 12,
    paddingHorizontal: 0,
    marginHorizontal: width * 0.075,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  headerNumber: {
    color: "#FFE7A0",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 2,
  },
  headerStoryType: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 2,
    marginRight: "auto",
  },
  heartIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFE7A0",
  },
  subtitle: {
    color: "#FFE7A0",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "left",
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
    marginBottom: 7,
    fontStyle: "italic",
  },
  imageWrap: {
    width: "100%",
    height: 140,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  balloonWrap: {
    position: "absolute",
    top: -28,
    left: "50%",
    transform: [{ translateX: -18 }],
    zIndex: 2,
  },
  balloonIcon: {
    width: 36,
    height: 36,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -28 }, { translateY: -28 }],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFE7A0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 3,
  },
  playIcon: {
    width: 36,
    height: 36,
    tintColor: "#05415F",
  },
  timeSelectorBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 5,
    width: "90%",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  timeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  timeButtonActive: {
    backgroundColor: "#AD D7DA",
  },
  timeButtonText: {
    color: "#AD D7DA",
    fontWeight: "600",
    fontSize: 16,
  },
  timeButtonTextActive: {
    color: "#05415F",
  },
  timeBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: "#07324A",
    borderRadius: 6,
    marginHorizontal: 8,
    position: "relative",
    overflow: "hidden",
  },
  timeBarIndicator: {
    position: "absolute",
    top: 0,
    width: "50%",
    height: "100%",
    backgroundColor: "#AD D7DA",
    borderRadius: 6,
  },
  line: {
    height: 8,
    width: 24,
    position: "absolute",
    left: 24,
    backgroundColor: "#fcfcfc3b",
    marginHorizontal: 4,
  },
  completeLine: {
    height: 8,
    width: 34,
    left: 30,
    backgroundColor: "#F4A672",
    marginHorizontal: 4,
  },
  activeLine: {
    height: 8,
    width: 28,
    left: 30,
    backgroundColor: "#fcfcfc3b",
    marginHorizontal: 4,
  },
});
