import React, { useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StoryCard2 } from "@/components/Cards";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Touchable,
} from "react-native";
import StoryItems from "./StoryItems";
import { useStoryStore } from "@/store/storyStore";
import { useSeriesStore } from "@/store/seriesStore";
import normalize from "@/app/lib/normalize";
import { Ionicons } from "@expo/vector-icons";

import IconArrowDown from "@/assets/images/icons/arrow-down.svg"
import IconCheck from "@/assets/images/parent/icon-check.svg"
interface Props {
  currentSeries: any;
  setCurrentSeries?: (c: any) => void;
}

export default function SeriesSelection({
  currentSeries,
  setCurrentSeries,
}: Props) {
  const router = useRouter();
  const stories = useStoryStore((state) => state.stories);
  const series = useSeriesStore((state) => state.series);
  const [filteredStories, setFilteredStories] = React.useState<any>([]);
  const [filteredSeries, setFilteredSeries] = React.useState<any>([]);
  const [selectedItem, setSelectedItem] = React.useState<string>("all");

  useEffect(() => {
    const filtered = stories.filter((story) => {
      return (
        normalize(story.seriesCategory) === normalize(currentSeries?.name)
      );
    });
    setFilteredStories(filtered);
  }, [currentSeries]);
  return (
    <ThemedView style={styles.selectionContainer}>
      <View style={styles.detailsSection}>
        <View style={[styles.selectionHeaderRow, {width: '100%'}]}>
          <View>
            <ThemedView style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <ThemedText
                style={[
                  styles.sectionTitle,
                  styles.selectionTitleLarge,
                  { lineHeight: 40 },
                ]}
              >
                {(currentSeries as any)?.name}
              </ThemedText>

              <TouchableOpacity
                style={{paddingRight: 10}}
                onPress={() => setCurrentSeries && setCurrentSeries(null)}>
                <IconArrowDown width={24} height={24} color={"#F4A672"} />
              </TouchableOpacity>
            </ThemedView>
            <ThemedText
              style={[styles.sectionTitle, styles.selectionTitleSmall]}
            >
              {(currentSeries as any)?.description ??
                currentSeries?.description_parent}
            </ThemedText>
          </View>
        </View>

        {/* Filters */}
        <View style={[styles.statsContainer, { gap: 5 }]}>
          <TouchableOpacity onPress={() => setSelectedItem("all")}>
            <View style={styles.statsIconContainer}>
              {selectedItem === "all" && (
                <IconCheck
                  width={14}
                  height={14}
                  color={"#F4A672"}
                  style={styles.statsIcon}
                />
              )}
              <ThemedText
                style={[
                  styles.statsText,
                  selectedItem === "all" && styles.statsTextOrange,
                ]}
              >
                ALL
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setSelectedItem("series")}>
            <View style={styles.statsIconContainer}>
              {selectedItem === "series" && (
                <IconCheck
                  width={14}
                  height={14}
                  color={"#F4A672"}
                  style={styles.statsIcon}
                />
              )}
              <ThemedText
                style={[
                  styles.statsText,
                  selectedItem === "series" && styles.statsTextOrange,
                ]}
              >
                {currentSeries?.series? currentSeries.series.length : 0} SERIES
              </ThemedText>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity onPress={() => setSelectedItem("stories")}>
            <View style={styles.statsIconContainer}>
              {selectedItem === "stories" && (
                <IconCheck
                  width={14}
                  height={14}
                  color={"#F4A672"}
                  style={styles.statsIcon}
                />
              )}
              <ThemedText
                style={[
                  styles.statsText,
                  selectedItem === "stories" && styles.statsTextOrange,
                ]}
              >
                {currentSeries?.stories? currentSeries.stories.length : 0} STORIES
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScrollContent}
      >
        <StoryItems
          seriesCategory={currentSeries?.name}
          tag="series"
          mode="parent"
          direction="vertical"
          seriesCategories={currentSeries}
          filter={selectedItem}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    paddingBottom: 120,
    alignItems: "center",
    borderColor: "rgba(122, 193, 198, 0.5)",
    borderWidth: 1,
    backgroundColor: "rgba(5, 59, 74, 1)",
    marginTop: 50,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  closeButtonCenter: {
    alignItems: "center",
    marginBottom: 20,
  },
  detailsSection: {
    marginBottom: 5,
    width: "100%",
    borderColor: "rgba(122, 193, 198, 0.5)",
    borderBottomWidth: 1,
    marginTop: 25,
  },
  selectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  avatarImg: {
    height: 30,
    width: 30,
  },
  avatarImgContainer: {
    borderColor: "#ffffff",
    borderWidth: 1.5,
    marginRight: 10,
    borderRadius: 999,
    backgroundColor: "rgba(122, 193, 198, 1)",
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 24,
    marginTop: 60,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  selectionTitleLarge: {
    marginTop: 0,
    fontSize: 24,
  },
  selectionTitleSmall: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "400",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  closeArrow: {
    tintColor: "#F4A672",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  statsText: {
    color: "#048F99",
    fontWeight: "600",
    fontSize: 18,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  statsIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsIcon: {
    marginRight: 4
  },
  statsTextOrange: {
    color: "#F4A672",
    fontWeight: "600",
    fontSize: 18,
  },
  cardScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  button: {
    flexDirection: "row",
    width: 270,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECA36D",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 50,
    marginHorizontal: "auto",
    marginBottom: 60,
  },
  addButtonIcon: {
    marginRight: 6,
  },
  addButtonTextContainer: {
    alignItems: "center",
  },
  ButtonText: {
    color: "#0D4B4F",
    fontSize: 16,
    fontWeight: "600",
  },
});
