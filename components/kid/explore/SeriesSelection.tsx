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

import IconArrowLeft from "@/assets/images/icons/arrow-left.svg";
import IconHeart from "@/assets/images/parent/footer/icon-heart.svg"

interface Props {
  currentSeries: any;
  setCurrentSeries?: (c: any | null) => void;
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

  const handleBackToExplore = () => {
    if (setCurrentSeries) {
      setCurrentSeries(null);
    }
  };


  return (
    <ThemedView style={{ paddingBottom: 80, alignItems: "center", paddingLeft: 20 }}>
      <IconHeart
        color={"#053B4A"}
        width={26}
        height={24}
        style={{ marginTop: 20, width: 26, height: 24 }}
      />
      <ThemedText style={[styles.sectionTitle, { marginTop: 10, color: "#048F99" }]}>{"SERIES"}</ThemedText>
      <ThemedText style={[styles.sectionTitle, { marginTop: 10, fontSize: 24 }]}>{currentSeries?.name}</ThemedText>
      <ThemedText style={[styles.sectiondesc, { marginBottom: 5, padding: 20, textAlign: "center" }]}>{currentSeries?.description}</ThemedText>
      <View style={{ backgroundColor: "#d0d0d08c", height: 1, width: 230 }}></View>
      <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 20 }}
        onPress={handleBackToExplore}
      >
        <IconArrowLeft
          width={24}
          height={24}
          color={"#fcfcfc"}
        />
        <ThemedText style={[styles.backButtonText, { marginTop: 0, marginBottom: 0 }]}>{"Back to Explore"}</ThemedText>
      </TouchableOpacity>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScrollContainer}
      >
        <StoryItems
          seriesCategory={currentSeries?.name}
          tag="series"
          mode="kid"
          direction="vertical"
          seriesData={currentSeries}
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
    borderColor: "#053B4A",
    borderWidth: 1.5,
    marginRight: 10,
    borderRadius: 999,
    backgroundColor: "rgba(122, 193, 198, 1)",
  },
  sectionTitle: {
    color: "#053B4A",
    fontSize: 18,
    marginTop: 60,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  backButtonText: {
    color: "#053B4A",
    fontSize: 18,
    marginTop: 30,
    paddingHorizontal: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  cardScrollContainer: {
    gap: 20,
    paddingHorizontal: 16,
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
  sectiondesc: {
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  statsIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: "#F4A672",
  },
  statsTextOrange: {
    color: "#F4A672",
    fontWeight: "600",
    fontSize: 18,
  },
  cardScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
    paddingLeft: 30,
    paddingTop: 30,
  },
});
