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
import IconCheck from "@/assets/images/parent/icon-check.svg"


interface Props {
  currentCharacter: any;
  setCurrentCharacter?: (c: any) => void;
}

export default function CharacterSelection({
  currentCharacter,
  setCurrentCharacter,
}: Props) {
  const router = useRouter();
  const stories = useStoryStore((state) => state.stories);
  const series = useSeriesStore((state) => state.series);
  const [filteredStories, setFilteredStories] = React.useState<any>([]);
  const [filteredSeries, setFilteredSeries] = React.useState<any>([]);
  const [selectedItem, setSelectedItem] = React.useState<string>("all");

  useEffect(() => {
    const filtered = stories.filter((story) => {
      // If story has a `characters` field, it may be an array OR an object like
      const chars = story.characters;
      if (chars && typeof chars === "object") {
        // object of arrays (e.g., { primary: [...], secondary: [...] })
        return Object.values(chars).some(
          (arr: any) =>
            Array.isArray(arr) &&
            arr.some(
              (ch: any) =>
                normalize(
                  typeof ch === "object" ? ch?.name ?? String(ch) : ch
                ) === normalize(currentCharacter?.name)
            )
        );
      }
    });
    setFilteredStories(filtered);
  }, [currentCharacter]);
  return (
    <ThemedView style={styles.selectionContainer}>
      <View style={styles.detailsSection}>
        <View style={styles.selectionHeaderRow}>
          <View>
            <View
              style={[
                styles.avatarImgContainer,
                {
                  width: 60,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 18,
                  marginBottom: 5,
                },
              ]}
            >
              <Image
                source={
                  (currentCharacter as any)?.avatar_url
                    ? { uri: currentCharacter.avatar_url }
                    : require("@/assets/images/avatars/dano_badger.png")
                }
                style={[styles.avatarImg]}
              />
            </View>
            <ThemedText
              style={[
                styles.sectionTitle,
                styles.selectionTitleLarge,
                { lineHeight: 40 },
              ]}
            >
              {(currentCharacter as any)?.name}
            </ThemedText>
            <ThemedText
              style={[styles.sectionTitle, styles.selectionTitleSmall]}
            >
              {(currentCharacter as any)?.description ??
                currentCharacter?.description_parent}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCurrentCharacter && setCurrentCharacter(null)}
          >
            <Image
              source={require("@/assets/images/kid/arrow-down.png")}
              style={styles.closeArrow}
            />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={() => setSelectedItem("all")}>
            <View style={styles.statsIconContainer}>
              {selectedItem === "all" && (
                <IconCheck
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
                />
              )}
              <ThemedText
                style={[
                  styles.statsText,
                  selectedItem === "series" && styles.statsTextOrange,
                ]}
              >
                {filteredSeries.length} SERIES
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
                />
              )}
              <ThemedText
                style={[
                  styles.statsText,
                  selectedItem === "stories" && styles.statsTextOrange,
                ]}
              >
                {filteredStories.length} STORIES
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
          seriesCategory={currentCharacter?.name}
          tag="characters"
          mode="parent"
          direction="vertical"
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
