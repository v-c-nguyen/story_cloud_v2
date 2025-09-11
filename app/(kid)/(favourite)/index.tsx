import supabase from "@/app/lib/supabase";
import { useUser } from "@/app/lib/UserContext";
import BottomNavBar from "@/components/BottomNavBar";
import { StoryCard2 } from "@/components/Cards";
import { ItemSeriesRef } from "@/components/ItemSeries";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useFavoritesStore } from "@/store/favoritesStore";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";


const cardsData = [
  { color: '#FFFFFF', icon: require('@/assets/images/parent/series.png'), text: 'Series' },
  { color: '#F8ECAE', icon: require('@/assets/images/parent/collections.png'), text: 'Collections' },
  { color: '#ADD7DA', icon: require('@/assets/images/parent/map.png'), text: 'Map' },
  { color: '#7AC1C6', icon: require('@/assets/images/parent/themes.png'), text: 'Themes' },
  { color: '#053B4A', icon: require('@/assets/images/parent/characters.png'), text: 'Characters' },
];


const seriesData = [
  {
    title: "KAI’S LIVING ADVENTURE",
    image: "1",
    count: 8,
    isFavorite: true,
  },
  {
    title: "KAI’S CLIMATE QUEST",
    image: "2",
    count: 8,
    isFavorite: true,
  },
  {
    title: "KAI’S INVESTIGATION STATION",
    image: "3",
    count: 8,
    isFavorite: true,
  },
  {
    title: "KAI’S BIG ADVENTURES",
    image: "4",
    count: 8,
    isFavorite: true,
  },
  {
    title: "KAI’S NEIGHBORHOOD ADVENTURES",
    image: "5",
    count: 8,
    isFavorite: true,
  },
];


const storiesData = [
  {
    bgColor: "#F4A672",
    textColor: "#053B4A",
    subTextColor: "#F8ECAE",
    progressColor: "#ADD7DA",
    isBallonYellow: true,
    number: "#1",
    storyTitle: "Petal Tales: The Search for Rainbow Flowers",
    seriesTitle: "KAI’S LIVING ADVENTURE",
    duration: 32,
    progress: 20,
    image: "1",
    featured: false,
    isFavorite: true,
    watched: false,
  },
  {
    bgColor: "#053B4A",
    textColor: "#FCFCFC",
    subTextColor: "#F8ECAE",
    progressColor: "#F8ECAE",
    isBallonYellow: false,
    number: "#2",
    storyTitle: "Petal Tales: The Search for Rainbow Flowers",
    seriesTitle: "Underwater Adventures",
    duration: 32,
    progress: 12,
    image: "2",
    featured: false,
    isFavorite: true,
    watched: false,
  },
  {
    bgColor: "#F8ECAE",
    textColor: "#053B4A",
    subTextColor: "#048F99",
    progressColor: "#ADD7DA",
    isBallonYellow: false,
    number: "#3",
    storyTitle: "Muddy Mystery at the Pond",
    seriesTitle: "KAI’S LIVING ADVENTURE",
    duration: 32,
    progress: 20,
    image: "3",
    featured: true,
    isFavorite: true,
    watched: false,
  },
  {
    bgColor: "#053B4A",
    textColor: "#FCFCFC",
    subTextColor: "#F8ECAE",
    progressColor: "#F8ECAE",
    isBallonYellow: true,
    number: "#4",
    storyTitle: "Seeds of Surprise",
    seriesTitle: "KAI’S LIVING ADVENTURE",
    duration: 32,
    progress: 12,
    image: "2",
    featured: true,
    isFavorite: true,
    watched: false,
  },
  {
    bgColor: "#F8ECAE",
    textColor: "#053B4A",
    subTextColor: "#F8ECAE",
    progressColor: "#F4A672",
    isBallonYellow: true,
    number: "#5",
    storyTitle: "The Great Garden Clean-Up",
    seriesTitle: "KAI’S LIVING ADVENTURE",
    duration: 32,
    progress: 20,
    image: "1",
    featured: false,
    isFavorite: true,
    watched: true,
  },
  {
    bgColor: "#053B4A",
    textColor: "#FCFCFC",
    subTextColor: "#F8ECAE",
    progressColor: "#ADD7DA",
    isBallonYellow: false,
    number: "#7",
    storyTitle: "A Night with Nocturnal Neighbours",
    seriesTitle: "KAI’S LIVING ADVENTURE",
    duration: 32,
    progress: 20,
    image: "3",
    featured: false,
    isFavorite: false,
    watched: true,
  },
];

export default function Favourites() {

  const [series, setSeries] = useState<any[]>([]);
  const { child } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const itemSeriesRef = useRef<ItemSeriesRef>(null);
  // Favorites store setters
  const setFavoriteStories = useFavoritesStore((s) => s.setStories);
  const setFavoriteSeries = useFavoritesStore((s) => s.setSeries);
  const favoriteStories = useFavoritesStore((s) => s.stories);

  const handleBackToExplore = () => {
    setSelectedSeries(null);
    if (itemSeriesRef.current) {
      itemSeriesRef.current.resetSelection();
    }
  };

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke(`favorites/${child?.id}`, {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching favorites:', error.message);
        } else if (data) {
          // Save to favorites store
          setFavoriteStories(data.stories || []);
          setFavoriteSeries(data.series || []);
        }
      } catch (e) {
        console.error('Error fetching favorites:', e);
      } finally {
        setLoading(false);
      }
    }
    if (child?.id) fetchFavorites();
  }, [child]);

  function SectionHeader({ title, desc, link }: { title: string; desc: string, link: string }) {
    return (
      <ThemedView >
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectiondesc}>{desc}</ThemedText>
          {/* <Link href={`/kid/dashboard/${link}`}>
          <Image
            source={require("@/assets/images/kid/arrow-right.png")}
            style={styles.sectionArrow}
          />
        </Link> */}
          <TouchableOpacity onPress={() => { setSelectedSeries(title) }}>
            <Image
              source={require("@/assets/images/kid/arrow-right.png")}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  useEffect(() => {
    async function fetchSeries() {
      setLoading(true);
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke('series-categories', {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching series:', error.message);

        } else if (data && Array.isArray(data.data)) {
          setSeries(data.data);
        }
      } catch (e) {
        console.error('Error fetching focus modes:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchSeries();
  }, []);

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
          <ThemedView style={styles.headingWrap}>
            <Image
              source={require("@/assets/images/kid/logo-ballon.png")}
              style={styles.logoBallon}
              resizeMode="cover"
            />
            <Image
              source={require("@/assets/images/kid/logo-baby.png")}
              style={styles.logoBallon}
              resizeMode="cover"
            />
          </ThemedView>

          {/* Header */}
          <ThemedText style={styles.headerTitle}>All your favorites in one easy place</ThemedText>

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
                <Image source={require('@/assets/images/parent/icon-search.png')} style={styles.searchIcon}></Image>
                <TextInput
                  placeholder="Search for your next adventure..."
                  placeholderTextColor={'#D9D9D9'}
                  style={styles.searchText}
                />
                <Image source={require('@/assets/images/parent/Microphone4.png')} style={styles.searchIcon}></Image>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.mainContent}>
            <ThemedView style={styles.content}>
              {/* Tab Bar */}
              <ThemedText style={styles.subtitle}>Stories | {favoriteStories?.length} total</ThemedText>
              <ThemedView style={{ flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20 }}>
                {
                  favoriteStories.length > 0 && favoriteStories.map((story, index) => (
                    <StoryCard2 key={index} {...story} />
                  ))
                }
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
          <BottomNavBar active="Favourites" theme="light" image={true} />
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
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  subtitle: {
    color: "#053B4A",
    fontSize: 20,
    marginTop: 20,
    paddingHorizontal: 40,
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
    paddingHorizontal: 16,
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
});