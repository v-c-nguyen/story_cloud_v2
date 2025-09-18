
import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import MapWrapper from "@/components/MapWrapper";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { storyOptionsData } from "@/data/libraryData";
import { Stack, router } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import IconLearning from "@/assets/images/parent/footer/icon-learning.svg";
import IconSearch from "@/assets/images/icons/icon-search.svg";
import IconSwap from "@/assets/images/icons/icon-swap.svg";
import MapListWithBadge from "@/components/parent/learning/library/MapListWithBadge";
import supabase from "@/app/lib/supabase";
import { useCharactersStore } from "@/store/charactersStore";
import normalize from "@/app/lib/normalize";
import { useUser } from "@/app/lib/UserContext";
import IconList from "@/assets/images/icons/icon-list.svg"
import IconDown from "@/assets/images/icons/icon-chevrondown.svg"
import { useLocationsStore } from "@/store/locationsStore";

export default function StorylandMapLibrary() {
  const { child } = useUser();
  const characters = useCharactersStore((s) => s.characters);
  const setCharacters = useCharactersStore((s) => s.setCharacters);
  const locations = useLocationsStore((s) => s.locations);
  const setLocations = useLocationsStore((s) => s.setLocations);
  const [categories, setCategory] = React.useState<any[]>([]);
  const [characterLoading, setCharacterLoading] = React.useState(false);
  const [landmarkLoading, setlandmarkLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const storyOptions = storyOptionsData;
  const [activeItem, setActiveItem] = React.useState('Storyland Map');
  const [activeTab, setActiveTab] = React.useState('characters');
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const currentCharacter = useCharactersStore((s) => s.currentCharacter);
  const setCurrentCharacter = useCharactersStore((s) => s.setCurrentCharacter);
  const currentLocation = useLocationsStore((s) => s.currentLocation);
  const setCurrentLocation = useLocationsStore((s) => s.setCurrentLocation);

  useEffect(() => {
    setLoading(true);
    setCharacterLoading(true);
    setlandmarkLoading(true);
    async function fetchCharacters() {
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke('stories/characters', {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching map regions:', error.message);

        } else if (data && Array.isArray(data)) {
          setCharacters(data);
        }
      } catch (e) {
        console.error('Error fetching map regions:', e);
      } finally {
        setCharacterLoading(false);
      }
    }

    async function fetchLocations() {
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke('stories/locations', {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching locations:', error.message);

        } else if (data && Array.isArray(data)) {
          setLocations(data);
        }
      } catch (e) {
        console.error('Error fetching locations:', e);
      } finally {
        setlandmarkLoading(false);
      }
    }
    fetchCharacters();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (activeTab) {
      setCategory(activeTab == "characters" ? characters : locations);
    }
  }, [activeTab])

  useEffect(() => {
    console.log(characterLoading, landmarkLoading)
  }, [characterLoading, landmarkLoading])

  function handleItemSelection(item: string) {
    setActiveItem(item)
    setDropdownVisible(false)

    // Navigate to the appropriate screen based on selection
    switch (item) {
      case 'Stories':
        router.push('/(parent)/(learning)/(library)');
        break;
      case 'Series':
        router.push('/(parent)/(learning)/(library)/series');
        break;
      case 'Collections':
        router.push('/(parent)/(learning)/(library)/collections');
        break;
      case 'Themes':
        router.push('/(parent)/(learning)/(library)/themes');
        break;
      case 'Characters':
        router.push('/(parent)/(learning)/(library)/characters');
        break;
      case 'Learning Target':
        router.push('/(parent)/(learning)/(library)/learning-target');
        break;
      case 'Storyland Map':
        router.push('/(parent)/(learning)/(library)/storyland-map');
        break;
    }
  }

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <PatternBackground> */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeAreaContainer}>
        <ThemedView style={styles.themedViewContainer}>
          <ScrollView
            style={styles.rootContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {/* Top background */}
            <ThemedView style={{ position: 'relative' }}>
              <Image
                source={require("@/assets/images/parent/parent-back-pattern.png")}
                style={styles.topBackPattern}
                contentFit="cover"
              />

              <Header icon={IconLearning} role="parent" title="Learning" theme="dark"></Header>

              {/* Header */}
              <ThemedView style={styles.topRow}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('./(parent)/search-screen')}>
                  <IconSearch width={20} height={20} color={'rgba(173, 215, 218, 1)'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <IconSwap width={20} height={20} color={'rgba(173, 215, 218, 1)'} />
                </TouchableOpacity>

                {/* Dropdown toggle */}
                <TouchableOpacity
                  style={styles.dropdownToggle}
                  onPress={() => setDropdownVisible(!dropdownVisible)}
                >
                  <ThemedView style={styles.ActiveItemStyle} >
                    <IconList width={21} height={21} />
                  </ThemedView>
                  <ThemedText style={styles.dropdownText}>{activeItem}</ThemedText>
                  <IconDown width={16} height={16} color={"rgba(122, 193, 198, 1)"} />
                </TouchableOpacity>
              </ThemedView>


              {/* Dropdown modal */}
              <Modal
                transparent
                visible={dropdownVisible}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  onPress={() => setDropdownVisible(false)}
                  activeOpacity={1}
                >
                  <ThemedView style={styles.dropdownMenu}>
                    {storyOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => handleItemSelection(option)} >
                        <ThemedView style={[{ padding: 3 }, option === activeItem && styles.ActiveItemStyle]} >
                          <IconList
                            color={
                              option === activeItem
                                ? "rgba(5, 59, 74, 1)"
                                : "rgba(122, 193, 198, 1)"
                            }
                          />
                        </ThemedView>
                        <ThemedText style={styles.dropdownItemText}>{option}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                </TouchableOpacity>
              </Modal>
            </ThemedView>
            {!(currentCharacter || currentLocation) &&
              (
                <ThemedView style={styles.bottomPadding}>
                  <ThemedView>
                    <MapWrapper 
                      activeTab={activeTab} 
                      setActiveTab={setActiveTab} 
                      characterLoading={characterLoading}
                      landmarkLoading={landmarkLoading}
                    />
                  </ThemedView>
                </ThemedView>
              )}

            {/* Category pills */}
            <FlatList
              horizontal
              data={categories.map((ele) => ele)}
              keyExtractor={(item) => item.name || item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleStoryItem(item.name)}>
                  <ThemedView
                    style={[
                      styles.categoryPill,
                      (currentCharacter &&
                        (currentCharacter as any).name.trim() === item.name.trim()) ||
                        (currentLocation &&
                          (currentLocation as any).name.trim() === item.name.trim())
                        ? styles.categoryPillActive
                        : styles.categoryPillInactive

                    ]}
                  >
                    <View
                      style={[
                        styles.avatarImgContainer,
                        currentCharacter &&
                          (currentCharacter as any).name.trim() === item.name.trim()
                          ? { backgroundColor: "#F4A672" }
                          : null,
                        currentLocation &&
                          (currentLocation as any).name.trim() === item.name.trim()
                          ? { backgroundColor: "#F4A672" }
                          : null,
                      ]}
                    >
                      <Image
                        source={
                          item?.avatar_url
                            ? { uri: item.avatar_url }
                            : require("@/assets/images/avatars/dano_badger.png")}
                        style={[styles.avatarImg]}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <ThemedText
                        style={[
                          styles.categoryText,
                          currentCharacter &&
                            (currentCharacter as any).name.trim() === item.name.trim()
                            ? { color: "rgba(5, 59, 74, 1)" }
                            : null,
                          currentLocation &&
                            (currentLocation as any).name.trim() === item.name.trim()
                            ? { color: "rgba(5, 59, 74, 1)" }
                            : null,
                        ]}
                      >
                        {item.name.trim()}
                      </ThemedText>
                    </View>
                  </ThemedView>
                </TouchableOpacity>
              )}
              style={styles.categoryPillsContainer}
              showsHorizontalScrollIndicator={false}
            />

            <ThemedView style={styles.bottomPadding}>
              <MapListWithBadge
                charactersCategories={categories}
                characterLoading={characterLoading}
                landmarkLoading={landmarkLoading}
                activeTab={activeTab}
              />
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
            <BottomNavBar role="parent" active="Learning" subActive="Library" />
          </ThemedView>
        </ThemedView>
      </SafeAreaView >
      {/* </PatternBackground> */}
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "rgba(5, 59, 74, 1)",
    position: "relative",
    paddingBottom: 60
  },
  selectionContainer: {
    paddingBottom: 120,
    alignItems: "center",
    borderColor: "rgba(122, 193, 198, 0.5)",
    borderWidth: 1,
    backgroundColor: "rgba(5, 59, 74, 1)",
    marginTop: 50,
    borderRadius: 20,
    marginHorizontal: 16,
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
    fontStyle: 'italic',
    lineHeight: 24,
  },
  sectionArrow: {
    width: 24,
    height: 24,
  },
  cardScrollContainer: {
    gap: 20,
    paddingHorizontal: 16,
  },
  topRow: {
    marginTop: 30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginRight: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(122, 193, 198, 0.5)',
    borderRadius: 50
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(122, 193, 198, 0.5)',
    padding: 3,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  dropdownText: {
    color: 'rgba(122, 193, 198, 1)',
    fontSize: 16,
    marginHorizontal: 6,
    fontWeight: '400',
  },
  categoryPill: {
    flexDirection: "row",
    backgroundColor: "rgba(122, 193, 198, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(173, 215, 218, 0.5)",
    borderRadius: 20,
    marginTop: 12,
    marginRight: 8,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
    color: 'rgba(173, 215, 218, 1)',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    backgroundColor: '#003F4D',
    borderRadius: 20,
    borderColor: 'rgba(122, 193, 198, 0.5)',
    borderWidth: 1,
    paddingHorizontal: 3,
    marginTop: 100,
    marginRight: 20,
    width: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  dropdownItemText: {
    color: 'rgba(122, 193, 198, 1)',
    fontSize: 16,
  },
  ActiveItemStyle: {
    backgroundColor: 'rgba(244, 166, 114, 1)',
    borderRadius: '50%',
    padding: 3
  },
  detailsSection: {
    marginBottom: 5,
    width: "100%",
    borderColor: "rgba(122, 193, 198, 0.5)",
    borderBottomWidth: 1,
    marginTop: 40,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  safeAreaContainer: {
    flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)'
  },
  themedViewContainer: {
    flex: 1,
    display: "flex",
    position: "relative"
  },
  scrollViewContent: {
    paddingBottom: 55
  },
  categoryPillActive: {
    backgroundColor: 'rgba(122, 193, 198, 1)'
  },
  categoryPillInactive: {
    backgroundColor: 'rgba(122, 193, 198, 0.2)'
  },
  categoryPillsContainer: {
    paddingHorizontal: 16
  },
  selectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20
  },
  selectionTitleLarge: {
    marginTop: 0,
    fontSize: 30
  },
  selectionTitleSmall: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "100"
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20
  },
  closeArrow: {
    tintColor: "#F4A672"
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    justifyContent: "center"
  },
  statsText: {
    color: "#048F99",
    fontWeight: "700",
    fontSize: 20
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: "#ccc",
    marginHorizontal: 8
  },
  statsIconContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  statsIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: "#F4A672"
  },
  statsTextOrange: {
    color: "#F4A672",
    fontWeight: "700",
    fontSize: 20
  },
  cardScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
    paddingLeft: 30,
    paddingTop: 30
  },
  bottomPadding: {
    paddingBottom: 80
  },
  arrowIcon: {
    tintColor: "#F4A672",
    marginRight: 16,
    marginBottom: 10
  },
  avatarImg: {
    height: 48,
    width: 48,
    position: "absolute",
    borderRadius: 24,
  },
  avatarImgContainer: {
    width: 50,
    height: 50,
    borderColor: "#ffffff",
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 50,
    backgroundColor: "rgba(122, 193, 198, 1)",
  },
});