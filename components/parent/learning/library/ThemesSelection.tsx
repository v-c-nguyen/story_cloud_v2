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

import IconArrowDown from "@/assets/images/icons/arrow-down.svg"

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
  const [filteredSeries, setFilteredSeries] = React.useState<any>([]);
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
  return (
    <ThemedView style={styles.selectionContainer}>
      <View style={styles.detailsSection}>
        <View style={styles.selectionHeaderRow}>
          <View style={{width: "100%"}}>
            <ThemedView style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%',}}>
              <ThemedText
                style={[
                  styles.sectionTitle,
                  styles.selectionTitleLarge,
                  { lineHeight: 40 },
                ]}
              >
                {(currentTheme as any)?.symbol.trim()}
                {(currentTheme as any)?.name}
              </ThemedText>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCurrentTheme && setCurrentTheme(null)}
              >
                <IconArrowDown width={24} height={24} color={"#F4A672"} />
              </TouchableOpacity>
            </ThemedView>
            <ThemedText
              style={[styles.sectionTitle, styles.selectionTitleSmall]}
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
          themesCategories={currentTheme}
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
    fontWeight: "700",
    lineHeight: 24,
  },
  selectionTitleLarge: {
    fontSize: 24,
  },
  selectionTitleSmall: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "400",
  },
  closeButton: {
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
    paddingTop: 30,
  },
});
