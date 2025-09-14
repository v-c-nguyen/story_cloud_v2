import supabase from "@/app/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useStoryStore } from "@/store/storyStore";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import StoryItems from "./StoryItems";
import { Series, useSeriesStore } from "@/store/seriesStore";
import normalize from "@/app/lib/normalize";
import SeriesSelection from "./SeriesSelection";

import IconAvatarRight from "@/assets/images/icons/arrow-right.svg"

interface ItemListWithBadgeProps {
  seriesCategories: any[];
}
const ItemListWidthBadge: React.FC<ItemListWithBadgeProps> = ({
  seriesCategories,
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
  // Use currentSeries from the store instead of props
  const currentKidSeries = useSeriesStore((s) => s.currentKidSeries);
  const setCurrentKidSeries = useSeriesStore((s) => s.setCurrentKidSeries);

  useEffect(() => {
    const targets = seriesCategories.filter((category) =>
      category.stories && category.stories.length > 0
    );
    setCategoriesWithStories(targets);
    setDisplayedCategories(targets);
  }, [seriesCategories]);

  useEffect(() => {
    if ((currentKidSeries as any)?.name) {
      const name =
        (currentKidSeries as any)?.name
      String(currentKidSeries);
      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else {
      setDisplayedCategories(categoriesWithStories);
    }
  }, [currentKidSeries, categoriesWithStories]);

  // using shared normalize

  function handleStoryItem(item: any) {
    if (!setCurrentKidSeries) return;
    if (currentKidSeries && (currentKidSeries as any)?.name === item) {
      setCurrentKidSeries(null);
    } else {
      setCurrentKidSeries(item);
    }
  }
  return (
    <ThemedView style={{ paddingBottom: 150, marginBottom: 30 }}>
      {
        (currentKidSeries as any)?.name ? (
          displayedCategories && displayedCategories.length > 0 && (
            <SeriesSelection currentSeries={displayedCategories[0]} setCurrentSeries={setCurrentKidSeries} />
          )
        ) :
          displayedCategories.map((category, index) => (
            <ThemedView key={index}>
              <ThemedView style={styles.headerTitleContainer}>
                <SectionHeader
                  title={category?.name}
                  desc={category?.description}
                  categories={seriesCategories}
                  link="continue"
                />
              </ThemedView>
              <StoryItems
                key={index}
                seriesCategory={category?.name}
                tag="series"
                mode="kid"
                seriesData={category}
              />
            </ThemedView>
          ))}
    </ThemedView>
  );
};

function SectionHeader({
  title,
  desc,
  categories,
  link
}: {
  title: string;
  desc: string;
  categories: any[];
  link: string;
}) {
  const setCurrentKidSeries = useSeriesStore((s) => s.setCurrentKidSeries);
  const currentKidSeries = useSeriesStore((s) => s.currentKidSeries);

  function handleSelectedItem(item: any) {
    // Toggle selection in the series store. Find the matching category object if available.
    if (!setCurrentKidSeries) return; // guard

    const found = categories.find((c: any) => c.name === item);

    if (currentKidSeries && (currentKidSeries as any).name === item) {
      setCurrentKidSeries(null);
    } else if (found) {
      // Save the full category object to the store
      setCurrentKidSeries(found as any);
    } else {
      // Fallback: save a minimal series object
      setCurrentKidSeries({ id: item, name: item } as any);
    }
  }
  return (
    <ThemedView >
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectiondesc}>{desc}</ThemedText>
        <TouchableOpacity onPress={() => { handleSelectedItem(title) }}>

          <IconAvatarRight
            width={24}
            height={24}
            color={"#053B4A"}
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

  horizontalScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#053B4A",
    fontSize: 24,
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectiondesc: {
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 24,
  },
  arrowIcon: {
    tintColor: "#048F99",
    marginBottom: 10,
    width: 24,
    height: 24
  },
});

export default ItemListWidthBadge;
