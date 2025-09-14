import normalize from "@/app/lib/normalize";
import supabase from "@/app/lib/supabase";
import BottomNavBar from "@/components/BottomNavBar";
import { SeriesCard } from "@/components/Cards";
import CardSeries from "@/components/CardSeries";
import { ItemSeries, ItemSeriesRef } from "@/components/ItemSeries";
import CharactersListWithBadge from "@/components/kid/explore/CharactersListWithBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCharactersStore } from "@/store/charactersStore";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import React, { use, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";


import IconSearch from "@/assets/images/icons/icon-search.svg"
import IconMic from "@/assets/images/icons/icon-micro.svg"
import IconAvatarRight from "@/assets/images/icons/arrow-right.svg"
import Header from "@/components/Header";
import { useUser } from "@/app/lib/UserContext";

const cardsData = [
  { color: '#FFFFFF', icon: require('@/assets/images/parent/series.png'), text: 'Series' },
  { color: '#F8ECAE', icon: require('@/assets/images/parent/collections.png'), text: 'Collections' },
  { color: '#ADD7DA', icon: require('@/assets/images/parent/map.png'), text: 'Map' },
  { color: '#7AC1C6', icon: require('@/assets/images/parent/themes.png'), text: 'Themes' },
  { color: '#053B4A', icon: require('@/assets/images/parent/characters.png'), text: 'Characters' },
];

export default function Characters() {
  const { child } = useUser();
  const [categories, setCategory] = React.useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const itemSeriesRef = useRef<ItemSeriesRef>(null);
  // Use characters store for selection
  const currentCharacter = useCharactersStore((s) => s.currentKidCharacter);
  const setCurrentCharacter = useCharactersStore((s) => s.setCurrentKidCharacter);

  // Filter data based on search query
  const filteredCharacters = categories.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackToExplore = () => {
    setSelectedCharacter(null);
    setSearchQuery("");
    // Reset ItemSeries selection
    if (itemSeriesRef.current) {
      itemSeriesRef.current.resetSelection();
    }
  };
  function SectionHeader({ title, desc, photoLink }: { title: string; desc: string, photoLink: string }) {
    return (
      <ThemedView style={[styles.cardWrap, { marginTop: 20, alignItems: "flex-start" }]}>
        <View style={styles.avatarContainer}>
          <Image
            source={photoLink}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={[styles.sectiondesc, { flex: 1 }]}>{desc}</ThemedText>
          <TouchableOpacity onPress={() => { setSelectedCharacter(title) }}>
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
  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true);
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke('stories/characters', {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching characters:', error.message);

        } else if (data && Array.isArray(data)) {
          setCategory(data);
        }
      } catch (e) {
        console.error('Error fetching characters:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, []);


  function handleStoryItem(item: any) {
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
    <>
      <Stack.Screen options={{
        headerShown: false
      }} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.rootContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top background */}
          <Image
            source={require("@/assets/images/kid/top-back-pattern.png")}
            style={styles.topBackPattern}
            resizeMode="cover"
          />
          <Header role="kid" mode={child?.mode} />

          {/* Header */}
          <ThemedText style={styles.headerTitle}>StoryCloud Characters</ThemedText>

          <ThemedView style={styles.headerCloudWrap}>
            {/* Clouds */}
            <Image
              source={require("@/assets/images/kid/cloud-group-far.png")}
              style={styles.imgCloudFar}
              resizeMode="cover"
            />
            <Image
              source={require("@/assets/images/kid/cloud-group-near.png")}
              style={styles.imgCloudNear}
              resizeMode="cover"
            />
            {/* Header */}
            <ThemedView style={{ paddingTop: 25, paddingHorizontal: 16, width: '100%' }}>
              <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>StoryCloud Series</ThemedText>
              <ThemedView
                style={styles.searchBoxStyle}
              >
                <IconSearch color={"#053b4a7c"} width={26} height={26} />
                <TextInput
                  placeholder="Search for your next adventure..."
                  placeholderTextColor={'#053b4a7e'}
                  style={styles.searchText}
                />
                <IconMic width={28} height={28} />
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.mainContent}>
            <ThemedView style={styles.content}>
              {/* Tab Bar */}
              <CardSeries data={cardsData} active={'Characters'} />

              {/* Characters List */}
              <ItemSeries
                ref={itemSeriesRef}
                itemsData={filteredCharacters}
                onSelect={(item) => {
                  handleStoryItem(item ? item.name : null);
                }}
              />
              {/* Story List */}

              <CharactersListWithBadge
                charactersCategories={categories}
                mode="parent"
              />
            </ThemedView>
          </ThemedView>
        </ScrollView>
        {/* Sticky Bottom Navigation */}
        <ThemedView
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 178,
            zIndex: 1000,
          }}
        >
          <BottomNavBar active="Explore" theme="light" image={true} />
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#F8ECAE",
    position: "relative",
  },
  topBackPattern: {
    width: "100%",
    height: "100%",
    maxHeight: 1200,
    position: "absolute",
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
    color: "#053B4A",
    fontSize: 24,
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectiondesc: {
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: 'italic',
    lineHeight: 24,
  },
  headingWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 23,
  },
  logoBallon: { width: 48, height: 48 },
  headerTitle: {
    color: "#053B4A",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 33.6,
    textAlign: "center",
    marginTop: 67,
    marginBottom: 66,
  },
  backWrap: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 84,
    marginBottom: 58,
  },
  cardScrollContainer: {
    gap: 20,
    paddingHorizontal: 16,
  },
  imgArrowLeft: {
    width: 20,
    height: 20,
    alignSelf: "flex-end",
  },
  backText: {
    color: "#F4A672",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 18,
  },
  headerCloudWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -90,
    position: "relative",
  },
  mainContent: {
    height: '100%',
    marginTop: 90,
    backgroundColor: '#ffffff',
  },
  content: {
    marginTop: -90
  },
  imgCloudFar: {
    width: "100%",
    height: 278,
    position: "absolute",
    top: 0,
    left: 0,
  },
  imgCloudNear: {
    width: "100%",
    height: 279,
    position: "absolute",
    top: 42,
    left: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cardWrap: {
    marginBottom: 16,
    alignItems: "center",
  },
  searchBoxStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    width: "100%",
    fontSize: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: '#fff',
    gap: 10
  },
  searchText: {
    width: '100%',
    outlineWidth: 0,
    fontSize: 14,
    paddingVertical: 10
  },
  searchIcon: {

  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabItem: {
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
  },
  avatarContainer: {
    marginLeft: 16,
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  mainAvatar: {
    width: 80,
    height: 80,
  }
});