import supabase from "@/app/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useStoryStore } from "@/store/storyStore";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import StoryItems from "./StoryItems";
import { useSeriesStore } from "@/store/seriesStore";
import normalize from "@/app/lib/normalize";
import { Dimensions } from "react-native";

import IconArrowRightGradient from "@/assets/images/icons/arrow-right-gradient.svg"

const { width, height } = Dimensions.get("window");
interface ItemListWithBadgeProps {
  seriesCategories: any[];
  loading: boolean;
}
const ItemListWidthBadge: React.FC<ItemListWithBadgeProps> = ({
  seriesCategories,
  loading
}) => {
  const [categoriesWithStories, setCategoriesWithStories] = React.useState<
    any[]
  >([]);
  const [displayedCategories, setDisplayedCategories] = React.useState<any[]>(
    []
  );
  const currentSeries = useSeriesStore((s) => s.currentSeries);

  useEffect(() => {
    const targets = seriesCategories.filter((category) =>
      category.stories && category.stories.length > 0
    );
    console.log(targets)
    setCategoriesWithStories(targets);
    setDisplayedCategories(targets);
  }, [seriesCategories]);

  useEffect(() => {
    // If a current series is selected in the store, filter to that one; otherwise show all
    if (currentSeries) {
      const name =
        (currentSeries as any).name ??
        (currentSeries as any).series_category ??
        String(currentSeries);
      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else {
      setDisplayedCategories(categoriesWithStories);
    }
  }, [currentSeries, categoriesWithStories]);

  // using shared normalize


  return (
    <ThemedView style={{ marginBottom: 100, width: '100%', height: '100%' }}>

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
        <ThemedView style={[styles.loadingContainer, { height: height - 500 }]}>
          <Image
            source={require("@/assets/images/parent/parent-back-pattern.png")}
            style={styles.topBackPattern}
            contentFit="cover"
          />
          <ActivityIndicator color="#ffffff" style={{ marginTop: 20 }} />
        </ThemedView>
      )}

      {
        displayedCategories.map((category, index) => (
          <ThemedView key={index}>
            {/* Top background */}
            <Image
              source={require("@/assets/images/parent/parent-back-pattern.png")}
              style={styles.topBackPattern}
              contentFit="cover"
            />
            <ThemedView style={styles.headerTitleContainer}>
              <SectionHeader
                title={category.name}
                desc={category.description}
                link="continue"
              />
            </ThemedView>
            <StoryItems
              key={index}
              seriesCategory={category.name}
              tag="stories"
              mode="parent"
              seriesCategories={category}
            />
          </ThemedView>
        ))}
    </ThemedView>
  );
};

function SectionHeader({
  title,
  desc,
  link,
}: {
  title: string;
  desc: string;
  link: string;
}) {

  const currentSeries = useSeriesStore((s) => s.currentSeries);
  const setCurrentSeries = useSeriesStore((s) => s.setCurrentSeries);

  return (
    <ThemedView>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectiondesc}>{desc}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 10
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
  horizontalScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 24,
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectiondesc: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 24,
  },
  arrowIcon: {
    tintColor: "#F4A672",
    marginRight: 16,
    marginBottom: 10,
  },
});

export default ItemListWidthBadge;
