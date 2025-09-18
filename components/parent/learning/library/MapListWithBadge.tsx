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

import IconArrowRightGradient from "@/assets/images/icons/arrow-right-gradient.svg"
import MapWrapper from "@/components/MapWrapper";
import { useLocationsStore } from "@/store/locationsStore";
import LocationSelection from "./LocationSelection";

interface MapListWithBadgeProps {
  charactersCategories: any[];
  characterLoading: boolean;
  landmarkLoading: boolean;
  activeTab: string
}

const { width, height } = Dimensions.get("window");
const MapListWithBadge: React.FC<MapListWithBadgeProps> = ({
  charactersCategories,
  characterLoading,
  landmarkLoading,
  activeTab
}) => {
  const [categoriesWithStories, setCategoriesWithStories] = React.useState<
    any[]
  >([]);
  const [displayedCategories, setDisplayedCategories] = React.useState<any[]>(
    []
  );
  // Use characters store for selection
  const currentCharacter = useCharactersStore((s) => s.currentCharacter);
  const setCurrentCharacter = useCharactersStore((s) => s.setCurrentCharacter);
  const currentLocation = useLocationsStore((s) => s.currentLocation);
  const setCurrentLocation = useLocationsStore((s) => s.setCurrentLocation);

  useEffect(() => {
    const targets = charactersCategories.filter((category) =>
      category.stories && category.stories.length > 0 || category.series && category.series.length > 0
    );

    setCategoriesWithStories(targets);
    setDisplayedCategories(targets);
  }, [charactersCategories]);

  useEffect(() => {
    // If a current character is selected in the store, filter to that one; otherwise show all
    if (currentCharacter) {
      const name = (currentCharacter as any).name;
      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else if (currentLocation) {
      const name = (currentLocation as any).name;
      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else {
      setDisplayedCategories(categoriesWithStories);
    }
  }, [currentCharacter, currentLocation, categoriesWithStories]);

  // using shared normalize

  function handleStoryItem(item: any) {
    if (!setCurrentCharacter) return;
    if (currentCharacter && (currentCharacter as any).name === item.name) {
      setCurrentCharacter(null);
    } else {
      setCurrentCharacter(item);
    }
  }
  return (
    <ThemedView style={{ paddingBottom: 55 }}>

      {/* Top background */}
      {displayedCategories.length === 0 && 
        ((activeTab == "characters" && !characterLoading) ||
         (activeTab == "landmarks" && !landmarkLoading)) && (
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

      {displayedCategories.length === 0 && 
        ((characterLoading && activeTab == "characters") || 
        (landmarkLoading && activeTab == "landmarks")) && (
        <ThemedView style={[styles.loadingContainer, { height: height - 400 }]}>
          <Image
            source={require("@/assets/images/parent/parent-back-pattern.png")}
            style={styles.topBackPattern}
            contentFit="cover"
          />
          <ActivityIndicator color="#ffffff" style={{ marginTop: 20 }} />
        </ThemedView>
      )}
      {currentLocation ?
        displayedCategories &&
        displayedCategories.length > 0 && (
          <LocationSelection
            currentLocation={displayedCategories[0]}
            setCurrentLoation={setCurrentLocation}
          />
        )
        :
        currentCharacter
          ? displayedCategories &&
          displayedCategories.length > 0 && (
            <CharacterSelection
              currentCharacter={displayedCategories[0]}
              setCurrentCharacter={setCurrentCharacter}
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
                  activeTab={activeTab}
                  avatar={
                    (category as any)?.avatar_url
                      ? { uri: category.avatar_url }
                      : require("@/assets/images/avatars/dano_badger.png")
                  }
                  title={category.name}
                  desc={category.description_parent ?? category.description_narrative
                  }
                  link="continue"
                  categories={charactersCategories}
                />
                <TouchableOpacity onPress={() => handleStoryItem(category)}>
                  <IconArrowRightGradient width={24} height={24} />
                </TouchableOpacity>
              </ThemedView>
              <StoryItems
                key={index}
                seriesCategory={category.name}
                tag="characters"
                mode="parent"
                charactersCategories={category}
              />
            </ThemedView>
          ))}
    </ThemedView>
  );
};

function SectionHeader({
  activeTab,
  avatar,
  title,
  desc,
  link,
  categories
}: {
  activeTab: string,
  avatar: any;
  title: string;
  desc: string;
  link: string;
  categories: any[]
}) {

  const currentCharacter = useCharactersStore((s) => s.currentCharacter);
  const setCurrentCharacter = useCharactersStore((s) => s.setCurrentCharacter);
  const currentLocation = useLocationsStore((s) => s.currentLocation);
  const setCurrentLocation = useLocationsStore((s) => s.setCurrentLocation);
  function handleCharacterSelected(item: string) {
    console.log("item::", item)
    if (!setCurrentCharacter) return;
    // Find matching character object
    const found = categories.find(
      (c: any) => (c.name || String(c)).trim() === item
    );
    if (
      currentCharacter &&
      normalize((currentCharacter as any).name) === normalize(item)
    ) {
      setCurrentCharacter(null);
    } else if (found) {
      setCurrentCharacter(found as any);
    } else {
      setCurrentCharacter({ id: item, name: item } as any);
    }
  }


  function handleLocationSelected(item: string) {
    if (!setCurrentLocation) return;
    const found = categories.find((t: any) => t.name === item || t.id === item);
    if (
      currentLocation &&
      ((currentLocation as any).name === item || (currentLocation as any).id === item)
    ) {
      setCurrentLocation(null);
    } else if (found) {
      setCurrentLocation(found as any);
    } else {
      setCurrentLocation({ id: item, name: item } as any);
    }
  }

  function handleStoryItem(item: string) {
    if (activeTab == "characters")
      handleCharacterSelected(item);
    else
      handleLocationSelected(item);
  }

  return (
    <ThemedView>
      <ThemedView
        style={[
          styles.avatarImgContainer,
          {
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            margin: 18,
            marginBottom: 5,
            marginTop: 60,
          },
        ]}
      >
        <Image source={avatar} style={[styles.avatarImg]} />
      </ThemedView>
      <ThemedText style={styles.sectionTitle}>{title.trim()}</ThemedText>
      <ThemedView style={[styles.sectionHeader, { width: "100%" }]}>
        <ThemedText style={[styles.sectiondesc, { width: "85%" }]}>{desc}</ThemedText>

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
    height: 48,
    width: 48,
    borderRadius: 25,
    position: "absolute",
    right: 1
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

export default MapListWithBadge;
