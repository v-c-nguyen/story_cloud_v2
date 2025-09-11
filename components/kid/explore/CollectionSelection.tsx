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

interface Props {
  currentCollection: any;
  setCurrentCollection?: (c: any | null) => void;
}

export default function CollectionSelection({
  currentCollection,
  setCurrentCollection,
}: Props) {
  const router = useRouter();
  const stories = useStoryStore((state) => state.stories);
  const series = useSeriesStore((state) => state.series);

  const handleBackToExplore = () => {
    if (setCurrentCollection) {
      setCurrentCollection(null);
    }
  };


  return (
    <ThemedView style={{ paddingBottom: 80, alignItems: "center", paddingLeft: 20, marginTop: 50 }}>
      <ThemedText style={[styles.sectionTitle, { marginTop: 10, color: "#048F99", fontSize: 18 }]}>{"COLLECTION"}</ThemedText>
      <ThemedText style={[styles.sectionTitle, { marginTop: 10, textAlign: 'center' }]}>{currentCollection?.name}</ThemedText>
      <ThemedText style={[styles.sectiondesc, { padding: 20, paddingBottom: 0, marginBottom: 0, textAlign: "center" }]}>{currentCollection?.description_kid}</ThemedText>
      <View style={{ backgroundColor: "#d0d0d08c", height: 1, width: 230, marginBottom: 20}}></View>
      <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
        onPress={handleBackToExplore}
      >
        <Image
          source={require("@/assets/images/kid/arrow-left.png")}
          style={[styles.closeArrow, { width: 20, height: 20, tintColor: "#053B4A", marginRight: 10 }]}
        />
        <ThemedText style={[styles.backButtonText, { marginTop: 0, marginBottom: 0 }]}>{"Back to Explore"}</ThemedText>
      </TouchableOpacity>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScrollContainer}
      >
        <StoryItems
          seriesCategory={currentCollection?.name}
          tag="collections-details"
          mode="kid"
          direction="vertical"
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
    fontSize: 24,
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
