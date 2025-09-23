import supabase from "@/app/lib/supabase";
import BottomNavBar from "@/components/BottomNavBar";
import { SeriesCard } from "@/components/Cards";
import CardSeries from "@/components/CardSeries";
import { ItemSeries, ItemSeriesRef } from "@/components/ItemSeries";
import ThemesListWithBadge from "@/components/kid/explore/ThemesListWithBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemesStore } from "@/store/themesStore";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Image } from "expo-image";
import IconSearch from "@/assets/images/icons/icon-search.svg"
import IconMic from "@/assets/images/icons/icon-micro.svg"
import IconAvatarRight from "@/assets/images/icons/arrow-right.svg"
import Header from "@/components/Header";
import { useUser } from "@/app/lib/UserContext";
import IconSeries from "@/assets/images/parent/series.svg"
import IconCollections from "@/assets/images/parent/collections.svg"
import IconMap from "@/assets/images/parent/map.svg"
import IconThemes from "@/assets/images/parent/themes.svg"
import IconCharacters from "@/assets/images/parent/characters.svg"
import useIsMobile from "@/hooks/useIsMobile";

const cardsData = [
  { color: '#FFFFFF', icon: IconSeries, text: 'Series' },
  { color: '#F8ECAE', icon: IconCollections, text: 'Collections' },
  { color: '#ADD7DA', icon: IconMap, text: 'Map' },
  { color: '#7AC1C6', icon: IconThemes, text: 'Themes' },
  { color: '#053B4A', icon: IconCharacters, text: 'Characters' },
];

export default function Themes() {
  const { child } = useUser();
  const isMobile = useIsMobile();
  const [categories, setCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const itemSeriesRef = useRef<ItemSeriesRef>(null);
  // Use themes store for selection
  const currentKidTheme = useThemesStore((s) => s.currentKidTheme);
  const setCurrentKidTheme = useThemesStore((s) => s.setCurrentKidTheme);

  // Filter data based on search query
  const filteredThemes = categories.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackToExplore = () => {
    setSelectedTheme(null);
    setSearchQuery("");
    // Reset ItemSeries selection
    if (itemSeriesRef.current) {
      itemSeriesRef.current.resetSelection();
    }
  };


  function SectionHeader({ title, desc, link }: { title: string; desc: string, link: string }) {
    return (
      <ThemedView >
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectiondesc}>{desc}</ThemedText>
          <TouchableOpacity onPress={() => { setSelectedTheme(title) }}>
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
    async function fetchThemes() {
      setLoading(true);
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke('stories/themes', {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching themes:', error.message);

        } else if (data && Array.isArray(data)) {
          setCategory(data);
        }
      } catch (e) {
        console.error('Error fetching themes:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, []);


  function handleStoryItem(item: any) {
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
    <>
      <Stack.Screen options={{
        headerShown: false
      }} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.rootContainer}
          showsVerticalScrollIndicator={false}
        >

          <Image
            source={require("@/assets/images/auth/back-pattern.png")}
            style={styles.topBackPattern}
            contentFit="cover"
          />
          <Header role="kid" mode={child?.mode} />

          {/* Header */}
          <ThemedText style={styles.headerTitle}>StoryCloud Themes</ThemedText>

          <ThemedView style={styles.headerCloudWrap}>
            {/* Clouds */}
            {isMobile &&
              <Image
                source={require("@/assets/images/kid/cloud-group-far.png")}
                style={styles.imgCloudFar}
                contentFit="cover"
              />
            }
            {isMobile &&
              <Image
                source={require("@/assets/images/kid/cloud-group-near.png")}
                style={styles.imgCloudNear}
                contentFit="cover"
              />
            }
            {
              !isMobile &&
              <Image
                source={require("@/assets/images/kid/cloud-group.png")}
                style={styles.imgCloudTablet}
                contentFit="fill"
              />
            }
            {/* Header */}
            <ThemedView style={{ paddingTop: 25, marginTop: 30, paddingHorizontal: 16, width: '100%' }}>
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
              <CardSeries data={cardsData} active={'Themes'} />

              {/* Themes List */}
              <ItemSeries
                ref={itemSeriesRef}
                itemsData={filteredThemes}
                onSelect={(item) => {
                  handleStoryItem(item ? item.name : null);
                }}
              />
              <ThemedView >
                <ThemesListWithBadge
                  themesCategories={categories}
                  mode="parent"
                />
              </ThemedView>
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
    height: 400,
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
    paddingVertical: 5,
    borderRadius: 25,
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
  imgCloudTablet: {
    width: '105%',
    height: '180%',
    position: "absolute",
    top: 50,
    left: 0,
    zIndex: -100,
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
});