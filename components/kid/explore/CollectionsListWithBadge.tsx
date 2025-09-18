import supabase from "@/app/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useStoryStore } from "@/store/storyStore";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import StoryItems from "./StoryItems";
import { useSeriesStore } from "@/store/seriesStore";
import normalize from "@/app/lib/normalize";
import SeriesSelection from "./SeriesSelection";
import { useCollectionsStore } from "@/store/collectionsStore";
import CollectionSelection from "./CollectionSelection";

import IconAvatarRight from "@/assets/images/icons/arrow-right.svg"

interface CollectionsListWithBadgeProps {
  collectionCategories: any[];
}
const CollectionsListWithBadge: React.FC<CollectionsListWithBadgeProps> = ({
  collectionCategories,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [categoriesWithStories, setCategoriesWithStories] = React.useState<
    any[]
  >([]);
  const [displayedCategories, setDisplayedCategories] = React.useState<any[]>(
    []
  );
  const setSeries = useSeriesStore((state) => state.setSeries);
  // Use currentSeries from the store instead of props
  const currentKidCollection = useCollectionsStore((s) => s.currentKidCollection);
  const setCurrentKidCollection = useCollectionsStore((s) => s.setCurrentCollection);

  useEffect(() => {
    const targets = collectionCategories.filter((category) =>
      category.series && category.series.length > 0
    );
    setCategoriesWithStories(targets);
    // By default show all categories that have stories
    setDisplayedCategories(targets);
  }, [collectionCategories]);

  useEffect(() => {
    // If a current series is selected in the store, filter to that one; otherwise show all
    if ((currentKidCollection as any)?.name) {
      const name =
        (currentKidCollection as any)?.name

      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else {
      
      setDisplayedCategories(categoriesWithStories);
    }
  }, [currentKidCollection, categoriesWithStories]);

  // using shared normalize

  function handleStoryItem(item: any) {
    if (!setCurrentKidCollection) return;
    if (currentKidCollection && (currentKidCollection as any)?.name === item) {
      setCurrentKidCollection(null);
    } else {
      setCurrentKidCollection(item);
    }
  }
  return (
    <ThemedView style={{ paddingBottom: 150, marginBottom: 30, paddingLeft: 8 }}>
      {
        (currentKidCollection as any)?.name ? (
          displayedCategories && displayedCategories.length > 0 && (
            <CollectionSelection currentCollection={currentKidCollection} setCurrentCollection={setCurrentKidCollection} />
          )
        ) :
          displayedCategories.map((category, index) => (
            <ThemedView key={index} style={{ paddingLeft: 10}}>
              <ThemedView style={styles.headerTitleContainer}>
                <SectionHeader
                  title={category?.name}
                  desc={category?.description_kid}
                  categories={collectionCategories}
                  link="continue"
                />
              </ThemedView>
              <StoryItems
                key={index}
                seriesCategory={category?.name}
                tag="collections"
                seriesData={category}
                mode="kid"
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
  link,
}: {
  title: string;
  desc: string;
  categories: any[];
  link: string;
}) {

  const currentKidCollection = useCollectionsStore((s) => s.currentKidCollection);
  const setCurrentKidCollection = useCollectionsStore((s) => s.setCurrentKidCollection);

  function handleSelectedItem(item: any) {
    // Toggle selection in the series store. Find the matching category object if available.
    if (!setCurrentKidCollection) return; // guard

    const found = categories.find((c: any) => c.name === item);

    if (currentKidCollection && (currentKidCollection as any).name === item) {
      setCurrentKidCollection(null);
    } else if (found) {
      // Save the full category object to the store
      setCurrentKidCollection(found as any);
    } else {
      // Fallback: save a minimal series object
      setCurrentKidCollection({ id: item, name: item } as any);
    }
  }
  return (
    <ThemedView>
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
    marginBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#053B4A",
    fontSize: 24,
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
    width: "85%",
    fontWeight: "700",
    lineHeight: 24,
  },
  sectiondesc: {
    color: "#053B4A",
    fontSize: 16,
    width: "90%",
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

export default CollectionsListWithBadge;
