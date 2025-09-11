import supabase from "@/app/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useStoryStore } from "@/store/storyStore";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import StoryItems from "./StoryItems";
import normalize from "@/app/lib/normalize";
import { useCharactersStore } from "@/store/charactersStore";
import CharacterSelection from "./CharacterSelection";
import { useThemesStore } from "@/store/themesStore";
import ThemesSelection from "./ThemesSelection";

import IconArrowRightGradient from "@/assets/images/icons/arrow-right-gradient.svg"
interface ThemesListWithBadgeProps {
  themesCategories: any[];
  loading: boolean;
  mode: string;
}
const { width, height } = Dimensions.get("window");
const ThemesListWithBadge: React.FC<ThemesListWithBadgeProps> = ({
  themesCategories,
  loading,
  mode,
}) => {
  const [categoriesWithStories, setCategoriesWithStories] = React.useState<
    any[]
  >([]);
  const [displayedCategories, setDisplayedCategories] = React.useState<any[]>(
    []
  );
  // Use themes store for selection
  const currentTheme = useThemesStore((s) => s.currentTheme);
  const setCurrentTheme = useThemesStore((s) => s.setCurrentTheme);

  useEffect(() => {
    const targets = themesCategories.filter((category) =>
      category.stories && category.stories.length > 0 || category.series && category.series.length > 0
    );
    setCategoriesWithStories(targets);
    // By default show all categories that have stories
    setDisplayedCategories(targets);

  }, [themesCategories]);

  useEffect(() => {
    // If a current character is selected in the store, filter to that one; otherwise show all
    if (currentTheme) {
      const name = (currentTheme as any).name;
      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else {
      setDisplayedCategories(categoriesWithStories);
    }
  }, [currentTheme, categoriesWithStories]);

  // using shared normalize

  function handleStoryItem(item: any) {
    if (!setCurrentTheme) return;
    if (currentTheme && (currentTheme as any).name === item.name) {
      setCurrentTheme(null);
    } else {
      setCurrentTheme(item);
    }
  }
  return (
    <ThemedView style={{ paddingBottom: 55 }}>

      {/* Top background */}
      {displayedCategories.length === 0 && !loading && (
        <ThemedView style={[styles.loadingContainer, { height: height - 400 }]}>
          <Image
            source={require("@/assets/images/parent/parent-back-pattern.png")}
            style={styles.topBackPattern}
            contentFit="cover"
          />
          <ThemedText style={styles.loadingText}>
            No stories available in the library.
          </ThemedText>
        </ThemedView>
      )}

      {displayedCategories.length === 0 && loading && (
        <ThemedView style={[styles.loadingContainer, { height: height - 400 }]}>
          <Image
            source={require("@/assets/images/parent/parent-back-pattern.png")}
            style={styles.topBackPattern}
            contentFit="cover"
          />
          <ActivityIndicator color="#ffffff" style={{ marginTop: 20 }} />
        </ThemedView>
      )}
      {currentTheme
        ? displayedCategories &&
        displayedCategories.length > 0 && (
          <ThemesSelection
            currentTheme={displayedCategories[0]}
            setCurrentTheme={setCurrentTheme}
          />
        )
        : displayedCategories.map((category, index) => (
          <ThemedView key={index}>
            <Image
              source={require("@/assets/images/parent/parent-back-pattern.png")}
              style={styles.topBackPattern}
              contentFit="cover"
            />
            <ThemedView style={styles.headerTitleContainer}>
              <SectionHeader
                symbol={category.symbol}
                title={category.name}
                desc={
                  mode == "parent" ? category.parent : category.kid_friendly
                }
                link="continue"
                categories={themesCategories}
              />
              <TouchableOpacity onPress={() => handleStoryItem(category)}>
                <Image
                  source={require("@/assets/images/kid/arrow-right.png")}
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            </ThemedView>
            <StoryItems
              key={index}
              seriesCategory={category.name}
              tag="themes"
              mode="parent"
              themesCategories={category}
            />
          </ThemedView>
        ))}
    </ThemedView>
  );
};

function SectionHeader({
  symbol,
  title,
  desc,
  link,
  categories
}: {
  symbol: string;
  title: string;
  desc: string;
  link: string;
  categories: any[];
}) {

  const currentTheme = useThemesStore((s) => s.currentTheme);
  const setCurrentTheme = useThemesStore((s) => s.setCurrentTheme);

  function handleStoryItem(item: string) {
    if (!setCurrentTheme) return;
    const found = categories.find((t: any) => t.name === item || t.id === item);
    if (
      currentTheme &&
      ((currentTheme as any).name === item || (currentTheme as any).id === item)
    ) {
      setCurrentTheme(null);
    } else if (found) {
      setCurrentTheme(found as any);
    } else {
      setCurrentTheme({ id: item, name: item } as any);
    }
  }
  return (
    <ThemedView>
      <ThemedView style={[styles.sectionTitle, { flexDirection: "row" }]}>
        <ThemedText style={styles.sectionTitleText}>{symbol.trim()}</ThemedText>
        <ThemedText style={styles.sectionTitleText}>{title}</ThemedText>
      </ThemedView>
      <ThemedView style={[styles.sectionHeader, { width: "100%" }]}>
        <ThemedText style={styles.sectiondesc}>{desc}</ThemedText>

        <TouchableOpacity onPress={() => { handleStoryItem(title) }} >
          <IconArrowRightGradient width={24} height={24} style={{ marginBottom: 20 }} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  avatarImgContainer: {
    padding: 10,
    borderColor: "#ffffff",
    borderWidth: 1.5,
    marginRight: 10,
    borderRadius: 999,
    backgroundColor: "rgba(122, 193, 198, 1)",
  },
  horizontalScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
  },
  avatarImg: {
    height: 24,
    width: 24,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitleText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectiondesc: {
    color: "#ffffff",
    fontSize: 16,
    width: "80%",
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 24,
  },
  arrowIcon: {
    tintColor: "#F4A672",
    marginRight: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
  },
  topBackPattern: {
    width: '100%',
    height: '100%',
    position: "absolute",
  },
});

export default ThemesListWithBadge;
