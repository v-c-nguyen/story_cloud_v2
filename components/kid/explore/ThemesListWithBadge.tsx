import supabase from "@/app/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useStoryStore } from "@/store/storyStore";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import StoryItems from "./StoryItems";
import normalize from "@/app/lib/normalize";
import { useCharactersStore } from "@/store/charactersStore";
import CharacterSelection from "./CharacterSelection";
import { useThemesStore } from "@/store/themesStore";
import ThemesSelection from "./ThemesSelection";

interface ThemesListWithBadgeProps {
  themesCategories: any[];
  mode: string;
}
const ThemesListWithBadge: React.FC<ThemesListWithBadgeProps> = ({
  themesCategories,
  mode,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [categoriesWithStories, setCategoriesWithStories] = React.useState<
    any[]
  >([]);
  const [displayedCategories, setDisplayedCategories] = React.useState<any[]>(
    []
  );
  const stories = useStoryStore((state) => state.stories);
  const setStories = useStoryStore((state) => state.setStories);
  // Use themes store for selection
  const currentKidTheme = useThemesStore((s) => s.currentKidTheme);
  const setCurrentKidTheme = useThemesStore((s) => s.setCurrentKidTheme);

  useEffect(() => {
        const targets = themesCategories.filter((category) =>
          category.stories && category.stories.length > 0 || category.series && category.series.length > 0
        );

        setCategoriesWithStories(targets);
        setDisplayedCategories(targets);

  }, [themesCategories]);

  useEffect(() => {
    // If a current character is selected in the store, filter to that one; otherwise show all
    if ((currentKidTheme as any)?.name) {
      const name = (currentKidTheme as any).name;
      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else {
      setDisplayedCategories(categoriesWithStories);
    }
  }, [currentKidTheme, categoriesWithStories]);

  // using shared normalize

  function handleStoryItem(item: any) {
    if (!setCurrentKidTheme) return;
    if (currentKidTheme && (currentKidTheme as any).name === item.name) {
      setCurrentKidTheme(null);
    } else {
      setCurrentKidTheme(item);
    }
  }
  return (
    <ThemedView style={{ paddingBottom: 55 }}>
      {(currentKidTheme as any)?.name
        ? displayedCategories &&
        displayedCategories.length > 0 && (
          <ThemesSelection
            currentTheme={currentKidTheme}
            setCurrentTheme={setCurrentKidTheme}
          />
        )
        : displayedCategories.map((category, index) => (
          <ThemedView key={index}>
            <ThemedView style={styles.headerTitleContainer}>
              <SectionHeader
                symbol={category.symbol}
                title={category.name}
                desc={
                  mode == "parent" ? category.parent : category.kid_friendly
                }
                categories={themesCategories}
                link="continue"
              />
            </ThemedView>
            <StoryItems
              key={index}
              seriesCategory={category.name}
              tag="themes"
              mode="parent"
              themesData={category}
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
  categories,
  link,
}: {
  symbol: string;
  title: string;
  desc: string;
  categories: any[];
  link: string;
}) {

  const currentKidTheme = useThemesStore((s) => s.currentKidTheme);
  const setCurrentKidTheme = useThemesStore((s) => s.setCurrentKidTheme);

  function handleSelectedItem(item: any) {
    if (!setCurrentKidTheme) return;
    const found = categories.find((t: any) => t.name === item || t.id === item);
    if (
      currentKidTheme &&
      ((currentKidTheme as any).name === item || (currentKidTheme as any).id === item)
    ) {
      setCurrentKidTheme(null);
    } else if (found) {
      setCurrentKidTheme(found as any);
    } else {
      setCurrentKidTheme({ id: item, name: item } as any);
    }
  }
  
  return (
    <ThemedView>
      <ThemedView style={[styles.sectionTitle, { flexDirection: "row" }]}>
        <ThemedText style={styles.sectionTitleText}>{symbol.trim()}</ThemedText>
        <ThemedText style={styles.sectionTitleText}>{title}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectiondesc}>{desc}</ThemedText>
        <TouchableOpacity onPress={() => { handleSelectedItem(title) }}>
          <Image
            source={require("@/assets/images/kid/arrow-right.png")}
            style={styles.arrowIcon}
          />
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
    width: "100%",
    justifyContent: "space-between",
  },
  sectionTitle: {
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,

  },
  sectionTitleText: {
    color: "#053B4A",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectiondesc: {
    color: "#053B4A",
    width: '90%',
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 24,
  },
  arrowIcon: {
    tintColor: "#053B4A",
    marginRight: 16,
    marginBottom: 10,
    width: 24,
    height: 24
  },
});

export default ThemesListWithBadge;
