import supabase from "@/app/lib/supabase";
import BottomNavBar from "@/components/BottomNavBar";
import { SeriesCard, StoryCard2 } from "@/components/Cards";
import Header from "@/components/Header";
import { PatternBackground } from "@/components/PatternBackground";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { storyOptionsData } from "@/data/libraryData";
import { Stack, router } from "expo-router";
import React, { useEffect } from "react";
import { useThemesStore } from "@/store/themesStore";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ThemesListWithBadge from "@/components/parent/learning/library/ThemesListWithBadge";
import IconLearning from "@/assets/images/parent/footer/icon-learning.svg";
import IconSearch from "@/assets/images/icons/icon-search.svg";
import IconSwap from "@/assets/images/icons/icon-swap.svg";


const learningIcon = require("@/assets/images/parent/learning.png");
const searchIcon = require("@/assets/images/parent/icon-search.png");
const listIcon = require("@/assets/images/parent/icon-list.png");
const swapIcon = require("@/assets/images/parent/icon-swap.png");
const downIcon = require("@/assets/images/parent/down.png");

export default function ThemesLibrary() {
  const [categories, setCategory] = React.useState<any[]>([]);
  const storyOptions = storyOptionsData;
  const [loading, setLoading] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("Themes");
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  // Use themes store for selection
  const currentTheme = useThemesStore((s) => s.currentTheme);
  const setCurrentTheme = useThemesStore((s) => s.setCurrentTheme);

  useEffect(() => {
    async function fetchThemes() {
      setLoading(true);
      try {
        const jwt =
          supabase.auth.getSession &&
          (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke("stories/themes", {
          method: "GET",
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : "",
          },
        });
        if (error) {
          console.error("Error fetching themes:", error.message);
        } else if (data && Array.isArray(data)) {
          setCategory(data);
        }
      } catch (e) {
        console.error("Error fetching themes:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, []);

  function handleItemSelection(item: string) {
    setActiveItem(item);
    setDropdownVisible(false);

    // Navigate to the appropriate screen based on selection
    switch (item) {
      case "Stories":
        router.push("/(parent)/(learning)/(library)");
        break;
      case "Series":
        router.push("/(parent)/(learning)/(library)/series");
        break;
      case "Collections":
        router.push("/(parent)/(learning)/(library)/collections");
        break;
      case "Themes":
        router.push("/(parent)/(learning)/(library)/themes");
        break;
      case "Characters":
        router.push("/(parent)/(learning)/(library)/characters");
        break;
      case "Learning Target":
        router.push("/(parent)/(learning)/(library)/learning-target");
        break;
      case "Storyland Map":
        router.push("/(parent)/(learning)/(library)/storyland-map");
        break;
    }
  }

  function handleStoryItem(item: string) {
    if (!setCurrentTheme) return;
    const found = categories.find((t: any) => t.name === item || t.id === item);
    if (
      currentTheme &&
      ((currentTheme as any).name === item || (currentTheme as any).id === item)
    ) {
      setCurrentTheme(null);
    } else if (found) {
      setCurrentTheme(found as any);
    } else {
      setCurrentTheme({ id: item, name: item } as any);
    }
  }

  return (
    <PatternBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <ThemedView style={styles.themedViewContainer}>
          <ScrollView
            style={styles.rootContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <ThemedView style={{ position: 'relative' }}>
              {/* Top background */}
              <Image
                source={require("@/assets/images/parent/parent-back-pattern.png")}
                style={styles.topBackPattern}
                resizeMode="cover"
              />

              <Header
                icon={IconLearning}
                role="parent"
                title="Learning"
                theme="dark"
              ></Header>

              {/* Header */}
              <ThemedView style={styles.topRow}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(parent)/search-screen')}>
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
                  <ThemedView style={styles.ActiveItemStyle}>
                    <Image source={listIcon} tintColor={"rgba(5, 59, 74, 1)"} />
                  </ThemedView>
                  <ThemedText style={styles.dropdownText}>
                    {activeItem}
                  </ThemedText>
                  <Image source={downIcon} tintColor={"rgba(122, 193, 198, 1)"} />
                </TouchableOpacity>
              </ThemedView>

              {/* Category pills */}
              <FlatList
                horizontal
                data={categories.map((cat) => cat)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleStoryItem(item.name)}>
                    <ThemedView
                      style={[
                        styles.categoryPill,
                        { flexDirection: "row", gap: 5, alignItems: "center" },
                        currentTheme && (currentTheme as any).name === item.name
                          ? styles.categoryPillActive
                          : styles.categoryPillInactive,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.categoryText,
                          currentTheme && (currentTheme as any).name === item
                            ? { color: "rgba(5, 59, 74, 1)" }
                            : null,
                        ]}
                      >
                        {item.symbol.trim()}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.categoryText,
                          currentTheme && (currentTheme as any).name === item.name
                            ? { color: "rgba(5, 59, 74, 1)" }
                            : null,
                        ]}
                      >
                        {item.name}
                      </ThemedText>
                    </ThemedView>
                  </TouchableOpacity>
                )}
                style={styles.categoryPillsContainer}
                showsHorizontalScrollIndicator={false}
              />

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
                        onPress={() => handleItemSelection(option)}
                      >
                        <ThemedView
                          style={[
                            { padding: 3 },
                            option === activeItem && styles.ActiveItemStyle,
                          ]}
                        >
                          <Image
                            source={listIcon}
                            tintColor={
                              option === activeItem
                                ? "rgba(5, 59, 74, 1)"
                                : "rgba(122, 193, 198, 1)"
                            }
                          />
                        </ThemedView>
                        <ThemedText style={styles.dropdownItemText}>
                          {option}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                </TouchableOpacity>
              </Modal>
            </ThemedView>
            <ThemedView style={styles.bottomPadding}>
              <ThemesListWithBadge
                themesCategories={categories}
                loading={loading}
                mode="parent"
              />
            </ThemedView>
          </ScrollView>

          {/* Sticky Bottom Navigation */}
        </ThemedView>
      </SafeAreaView>
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
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    // backgroundColor: "rgba(5, 59, 74, 1)",
    position: "relative",
    paddingBottom: 60,
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
    fontStyle: "italic",
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
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginRight: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(122, 193, 198, 0.5)",
    borderRadius: 50,
  },
  dropdownToggle: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(122, 193, 198, 0.5)",
    padding: 3,
    borderRadius: 20,
    marginLeft: "auto",
  },
  dropdownText: {
    color: "rgba(122, 193, 198, 1)",
    fontSize: 16,
    marginHorizontal: 6,
    fontWeight: "400",
  },
  categoryPill: {
    backgroundColor: "rgba(122, 193, 198, 0.2)",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(173, 215, 218, 0.5)",
    borderRadius: 20,
    marginTop: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    color: "rgba(173, 215, 218, 1)",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdownMenu: {
    backgroundColor: "#003F4D",
    borderRadius: 20,
    borderColor: "rgba(122, 193, 198, 0.5)",
    borderWidth: 1,
    paddingHorizontal: 3,
    marginTop: 100,
    marginRight: 20,
    width: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  dropdownItemText: {
    color: "rgba(122, 193, 198, 1)",
    fontSize: 16,
  },
  ActiveItemStyle: {
    backgroundColor: "rgba(244, 166, 114, 1)",
    borderRadius: "50%",
    padding: 3,
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
    justifyContent: "space-between",
  },
  safeAreaContainer: {
    flex: 1,
  },
  themedViewContainer: {
    flex: 1,
    display: "flex",
    position: "relative",
  },
  scrollViewContent: {
    paddingBottom: 55,
  },
  categoryPillActive: {
    backgroundColor: "rgba(122, 193, 198, 1)",
  },
  categoryPillInactive: {
    backgroundColor: "rgba(122, 193, 198, 0.2)",
  },
  categoryPillsContainer: {
    paddingHorizontal: 16,
  },
  selectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  selectionTitleLarge: {
    marginTop: 0,
    fontSize: 30,
  },
  selectionTitleSmall: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "100",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  closeArrow: {
    tintColor: "#F4A672",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
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
  cardScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
    paddingLeft: 30,
    paddingTop: 30,
  },
  bottomPadding: {
    paddingBottom: 80,
  },
  arrowIcon: {
    tintColor: "#F4A672",
    marginRight: 16,
    marginBottom: 10,
  },
});
