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

import IconAvatarRight from "@/assets/images/icons/arrow-right.svg"

interface CharactersListWithBadgeProps {
  charactersCategories: any[];
  mode: string;
}
const CharactersListWithBadge: React.FC<CharactersListWithBadgeProps> = ({
  charactersCategories,
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
  // Use characters store for selection
  const currentCharacter = useCharactersStore((s) => s.currentKidCharacter);
  const setCurrentCharacter = useCharactersStore((s) => s.setCurrentKidCharacter);

  useEffect(() => {
    const targets = charactersCategories.filter((category) =>
      category.stories && category.stories.length > 0 || category.series && category.series.length > 0
    );

    setCategoriesWithStories(targets);
    setDisplayedCategories(targets);
  }, [charactersCategories]);

  useEffect(() => {
    // If a current character is selected in the store, filter to that one; otherwise show all
    if ((currentCharacter as any)?.name) {
      const name = (currentCharacter as any).name;
      setDisplayedCategories(
        categoriesWithStories.filter(
          (c) => normalize(c.name) === normalize(name)
        )
      );
    } else {
      setDisplayedCategories(categoriesWithStories);
    }
  }, [currentCharacter, categoriesWithStories]);

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
    <ThemedView style={{ paddingBottom: 55, paddingLeft: 10 }}>
      {(currentCharacter as any)?.name
        ? displayedCategories &&
        displayedCategories.length > 0 && (
          <CharacterSelection
            currentCharacter={currentCharacter}
            setCurrentCharacter={setCurrentCharacter}
          />
        )
        : displayedCategories.map((category, index) => (
          <ThemedView key={index}>
            <ThemedView style={styles.headerTitleContainer}>
              <SectionHeader
                avatar={
                  (category as any)?.avatar_url
                    ? { uri: category.avatar_url }
                    : require("@/assets/images/avatars/dano_badger.png")
                }
                title={category.name}
                desc={
                  mode == "parent"
                    ? category.description_parent
                    : category.description_kid
                }
                categories={charactersCategories}
                link="continue"
              />
            </ThemedView>
            <StoryItems
              key={index}
              seriesCategory={category.name}
              tag="characters"
              mode="parent"
              charactersData={category}
            />
          </ThemedView>
        ))}
    </ThemedView>
  );
};

function SectionHeader({
  avatar,
  title,
  desc,
  categories,
  link,
}: {
  avatar: any;
  title: string;
  desc: string;
  categories: any[];
  link: string;
}) {

  const currentCharacter = useCharactersStore((s) => s.currentKidCharacter);
  const setCurrentCharacter = useCharactersStore((s) => s.setCurrentKidCharacter);

  function handleSelectedItem(item: any) {
    if (!setCurrentCharacter) return;
    // Find matching character object
    const found = categories.find(
      (c: any) => (c.name || String(c))?.trim() === item?.trim()
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
  return (
    <ThemedView>
      <ThemedView
        style={[
          styles.avatarImgContainer,
          {
            margin: 18,
            marginBottom: 10,
            marginTop: 50,
          },
        ]}
      >
        <Image source={avatar} style={[styles.avatarImg]} />
      </ThemedView>
      <ThemedText style={styles.sectionTitle}>{title.trim()}</ThemedText>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectiondesc}>{desc.trim()}</ThemedText>
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
  avatarImgContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 50,
    backgroundColor: "#F8ECAE",
  },
  horizontalScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
  },
  avatarImg: {
    height: 42,
    width: 42,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 8,
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#053B4A",
    fontSize: 24,
    width: '85%',
    paddingHorizontal: 16,
    marginBottom: 10,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectiondesc: {
    width: '90%',
    color: "#053B4A",
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

export default CharactersListWithBadge;
