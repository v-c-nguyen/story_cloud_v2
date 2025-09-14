import supabase from "@/app/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSeriesStore } from "@/store/seriesStore";
import normalize from "@/app/lib/normalize";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import StoryItems from "./StoryItems";

import IconAvatarRight from "@/assets/images/icons/arrow-right.svg"
import IconArrowRightGradient from "@/assets/images/icons/arrow-right-gradient.svg"
import SeriesSelection from "./SeriesSelection";

const { width, height } = Dimensions.get("window");
interface SeriesListWithBadgeProps {
  seriesCategories: any[];
  loading: boolean;
}

const SeriesListWithBadge: React.FC<SeriesListWithBadgeProps> = ({
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
  const setCurrentSeries = useSeriesStore((s) => s.setCurrentSeries);

  useEffect(() => {
    const targets = seriesCategories.filter((category) =>
      category.series && category.series.length > 0
    );
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

  function handleStoryItem(item: any) {
    if (!setCurrentSeries) return;
    if (currentSeries && (currentSeries as any).name === item.name) {
      setCurrentSeries(null);
    } else {
      setCurrentSeries(item);
    }
  }
  return (
    <ThemedView style={{ paddingBottom: 55, width: '100%', height: '100%' }}>
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

      {currentSeries
        ? displayedCategories &&
        displayedCategories.length > 0 && (
          <SeriesSelection
            currentSeries={displayedCategories[0]}
            setCurrentSeries={setCurrentSeries}
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
                title={category.name}
                desc={category.description}
                link="continue"
              />
              <TouchableOpacity onPress={() => handleStoryItem(category)}>

                <IconAvatarRight
                  width={24}
                  height={24}
                  color={"#053B4A"}
                />
              </TouchableOpacity>
            </ThemedView>
            <StoryItems
              key={index}
              seriesCategory={category.name}
              filter="series"
              tag="series"
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

  function handleStoryItem(item: any) {
    if (!setCurrentSeries) return;
    if (currentSeries && (currentSeries as any).name === item.name) {
      setCurrentSeries(null);
    } else {
      setCurrentSeries(item);
    }
  }

  return (
    <ThemedView>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectiondesc}>{desc}</ThemedText>
        <TouchableOpacity onPress={() => { handleStoryItem(title) }} >
          <IconArrowRightGradient width={24} height={24} />
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
    width: '100%',
    marginTop: 0,
    marginBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 24,
    marginTop: 60,
    marginBottom: 8,
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

export default SeriesListWithBadge;
