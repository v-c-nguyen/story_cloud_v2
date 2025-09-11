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
import { useCollectionsStore } from "@/store/collectionsStore";
import CollectionSelection from "./CollectionSelection";

import IconArrowRightGradient from "@/assets/images/icons/arrow-right-gradient.svg"
interface CollectionsListWithBadgeProps {
  collectionsCategories: any[];
  loading: boolean;
  mode: string;
}
const { width, height } = Dimensions.get("window");
const CollectionsListWithBadge: React.FC<CollectionsListWithBadgeProps> = ({
  collectionsCategories,
  loading,
  mode,
}) => {
  const [categoriesWithStories, setCategoriesWithStories] = React.useState<
    any[]
  >([]);
  const [displayedCategories, setDisplayedCategories] = React.useState<any[]>(
    []
  );
  const [selectedItem, setSelectedItem] = React.useState<string>("all");
  // Use collections store for selection
  const currentCollection = useCollectionsStore((s) => s.currentCollection);
  const setCurrentCollection = useCollectionsStore(
    (s) => s.setCurrentCollection
  );

  useEffect(() => {
    if (collectionsCategories.length === 0) return;

    const targets = collectionsCategories.filter((category) =>
      category.stories && category.stories.length > 0
    );
    setCategoriesWithStories(targets);
    setDisplayedCategories(collectionsCategories);

  }, [collectionsCategories]);

  useEffect(() => {
    // If a current collection is selected in the store, filter to that one; otherwise show all
    if (currentCollection) {
      const name = (currentCollection as any).name;
      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else {
      setDisplayedCategories(categoriesWithStories);
    }
  }, [currentCollection, categoriesWithStories]);

  // using shared normalize

  function handleStoryItem(item: any) {
    if (!setCurrentCollection) return;
    if (currentCollection && (currentCollection as any).name === item.name) {
      setCurrentCollection(null);
    } else {
      setCurrentCollection(item);
    }
  }

  return (
    <ThemedView style={{ paddingBottom: 55, width: "100%", height: "100%" }}>

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
      {currentCollection
        ? displayedCategories &&
        displayedCategories.length > 0 && (
          <CollectionSelection
            currentCollection={displayedCategories[0]}
            setCurrentCollection={setCurrentCollection}
          />
        )
        : displayedCategories.map((category, index) => (
          <ThemedView key={index}>

            <Image
              source={require("@/assets/images/parent/parent-back-pattern.png")}
              style={styles.topBackPattern}
              contentFit="cover"
            />
            <ThemedView>
              <SectionHeader
                title={category.name}
                desc={
                  mode == "parent"
                    ? category.description_parent
                    : category.description_kid
                }
                link="continue"
              />

              <ThemedView style={styles.headerTitleContainer}>
                {/* Filters */}
                <ThemedView style={styles.statsContainer}>
                  <TouchableOpacity onPress={() => setSelectedItem("all")}>
                    <ThemedView style={styles.statsIconContainer}>
                      {selectedItem === "all" && (
                        <Image
                          source={require("@/assets/images/kid/check.png")}
                          style={styles.statsIcon}
                          contentFit="contain"
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
                    </ThemedView>
                  </TouchableOpacity>

                  <ThemedView style={styles.divider} />
                  <TouchableOpacity onPress={() => setSelectedItem("series")}>
                    <ThemedView style={styles.statsIconContainer}>
                      {selectedItem === "series" && (
                        <Image
                          source={require("@/assets/images/kid/check.png")}
                          style={styles.statsIcon}
                          contentFit="contain"
                        />
                      )}
                      <ThemedText
                        style={[
                          styles.statsText,
                          selectedItem === "series" && styles.statsTextOrange,
                        ]}
                      >
                        {category.series.length} SERIES
                      </ThemedText>
                    </ThemedView>
                  </TouchableOpacity>
                  <ThemedView style={styles.divider} />

                  <TouchableOpacity
                    onPress={() => setSelectedItem("stories")}
                  >
                    <ThemedView style={styles.statsIconContainer}>
                      {selectedItem === "stories" && (
                        <Image
                          source={require("@/assets/images/kid/check.png")}
                          style={styles.statsIcon}
                          contentFit="contain"
                        />
                      )}
                      <ThemedText
                        style={[
                          styles.statsText,
                          selectedItem === "stories" &&
                          styles.statsTextOrange,
                        ]}
                      >
                        {category.stories.length} STORIES
                      </ThemedText>
                    </ThemedView>
                  </TouchableOpacity>
                </ThemedView>

                <TouchableOpacity onPress={() => handleStoryItem(category)}>
                  <IconArrowRightGradient width={24} height={24} style={{marginBottom: 20}} />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
            <StoryItems
              key={index}
              seriesCategory={category.name}
              tag="collections"
              mode="parent"
              filter={selectedItem}
              collectionsCategories={category}
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
  return (
    <ThemedView>
      <ThemedText style={[styles.sectionTitle, { marginTop: 60 }]}>
        {title}
      </ThemedText>
      <ThemedView style={styles.sectionHeader}>
        {/* <Link href={`/kid/dashboard/${link}`}>
          <Image
            source={require("@/assets/images/kid/arrow-right.png")}
            style={styles.sectionArrow}
          />
        </Link> */}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
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
    color: "#ffffff",
    fontSize: 24,
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
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  statsText: {
    color: "#048F99",
    fontWeight: "700",
    fontSize: 20,
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
    fontWeight: "700",
    fontSize: 20,
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

export default CollectionsListWithBadge;
