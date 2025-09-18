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
import IconArrowDown from "@/assets/images/icons/arrow-down.svg";

interface Props {
  currentTheme: any;
  setCurrentTheme?: (c: any) => void;
}

export default function ThemesSelection({
  currentTheme,
  setCurrentTheme,
}: Props) {
  const router = useRouter();
  const stories = useStoryStore((state) => state.stories);
  const series = useSeriesStore((state) => state.series);
  const [filteredStories, setFilteredStories] = React.useState<any>([]);
  const [selectedItem, setSelectedItem] = React.useState<string>("all");

  useEffect(() => {
    const filtered = stories.filter((story) => {
      // If story has a `characters` field, it may be an array OR an object like
      const themes = story.themes;
      if (themes && Array.isArray(themes)) {
        return themes.some(
          (theme) =>
            normalize(theme?.name ?? String(theme)) ===
            normalize(currentTheme.name)
        );
      }
    });
    setFilteredStories(filtered);
  }, [currentTheme]);

  const handleBackToExplore = () => {
    if (setCurrentTheme) {
      setCurrentTheme(null);
    }
  };

  return (
    <ThemedView style={styles.selectionContainer}>
      <View style={styles.detailsSection}>
        <View style={styles.selectionHeaderRow}>
          <View>
            <ThemedText
              style={[
                styles.sectionTitle,
                styles.selectionTitleLarge,
                { lineHeight: 40, textAlign: 'center' },
              ]}
            >
              {(currentTheme as any)?.symbol?.trim()}
              {(currentTheme as any)?.name}
            </ThemedText>
            <ThemedText
              style={[styles.sectionTitle, styles.selectionTitleSmall, {textAlign: "center"}]}
            >
              {(currentTheme as any)?.parent}
            </ThemedText>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.statsContainer}>
          <ThemedText style={[styles.statsText]}>
            {currentTheme.stories ? currentTheme.stories.length : 0} STORIES
          </ThemedText>
        </View>
      </View>
      <View style={{ backgroundColor: "#d0d0d08c", height: 1, width: 230 }}></View>
      <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 20 }}
        onPress={handleBackToExplore}
      >
        <IconArrowLeft
          width={24}
          height={24}
          color={"#053B4A"}
        />
        <ThemedText style={[styles.backButtonText, { marginTop: 0, marginBottom: 0 }]}>{"Back to Explore"}</ThemedText>
      </TouchableOpacity>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScrollContent}
      >
        <StoryItems
          seriesCategory={currentTheme?.name}
          tag="themes"
          mode="parent"
          direction="vertical"
          filter={selectedItem}
          themesData={currentTheme}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    paddingBottom: 120,
    alignItems: "center",
    marginTop: 50,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  detailsSection: {
    marginBottom: 5,
    width: "100%",
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
    borderColor: "rgba(5, 59, 74, 1)",
    borderWidth: 1.5,
    marginRight: 10,
    borderRadius: 999,
    backgroundColor: "rgba(122, 193, 198, 1)",
  },
  sectionTitle: {
    color: "rgba(5, 59, 74, 1)",
    fontSize: 24,
    marginTop: 60,
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
  backButtonText: {
    color: "#053B4A",
    fontSize: 18,
    marginTop: 30,
    paddingHorizontal: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  closeArrow: {
    tintColor: "#F4A672",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
    justifyContent: "flex-start",
  },
  statsText: {
    color: "#048F99",
    fontWeight: "600",
    fontSize: 18,
    width: "100%",
    textAlign: "center"
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
