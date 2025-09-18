import supabase from "@/app/lib/supabase";
import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import ItemListWidthBadge from "@/components/parent/learning/library/ItemListWithBadge";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { storyOptionsData } from "@/data/libraryData";
import { useSeriesStore } from "@/store/seriesStore";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";


import IconLearning from "@/assets/images/parent/footer/icon-learning.svg";
import IconSearch from "@/assets/images/icons/icon-search.svg";
import IconSwap from "@/assets/images/icons/icon-swap.svg";
import IconList from "@/assets/images/icons/icon-list.svg"
import IconDown from "@/assets/images/icons/icon-chevrondown.svg"

export default function LearningLibrary() {
  const [categories, setCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const storyOptions = storyOptionsData;
  const [activeItem, setActiveItem] = useState("Stories");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const currentSeries = useSeriesStore((s) => s.currentSeries);
  const setCurrentSeries = useSeriesStore((s) => s.setCurrentSeries);
  const router = useRouter();
  const flatListRef = useRef<any>(null);
  const itemLayoutsRef = useRef<Array<{ x: number; width: number }>>([]);
  const containerWidthRef = useRef<number>(0);
  const contentWidthRef = useRef<number>(0);
  const lastScrollOffsetRef = useRef<number>(0);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);

  useEffect(() => {
    setLoading(true);
    async function fetchSeries() {
      try {
        const jwt =
          supabase.auth.getSession &&
          (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke(
          "stories/series",
          {
            method: "GET",
            headers: {
              Authorization: jwt ? `Bearer ${jwt}` : "",
            },
          }
        );
        if (error) {
          console.error("Error fetching series:", error.message);
        } else if (data && Array.isArray(data)) {
          setCategory(data);
        }
      } catch (e) {
        console.error("Error fetching focus modes:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSeries();
  }, []);

  function handleItemSelection(item: string) {
    setActiveItem(item);
    setDropdownVisible(false);

    switch (item) {
      case "Stories":
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

  function handleStoryItem(item: any) {
    // Toggle selection in the series store. Find the matching category object if available.
    if (!setCurrentSeries) return; // guard

    const found = categories.find((c: any) => c.name === item);

    if (currentSeries && (currentSeries as any).name === item) {
      setCurrentSeries(null);
    } else if (found) {
      // Save the full category object to the store
      setCurrentSeries(found as any);
    } else {
      // Fallback: save a minimal series object
      setCurrentSeries({ id: item, name: item } as any);
    }
  }

  function handleItemLayout(layout: { x: number; width: number }, index: number) {
    itemLayoutsRef.current[index] = layout;
    // recompute content width
    contentWidthRef.current = itemLayoutsRef.current.reduce(
      (sum, it) => sum + (it?.width ?? 0),
      0
    );
  }

  function clamp(n: number, min = 0, max = Number.MAX_SAFE_INTEGER) {
    return Math.max(min, Math.min(n, max));
  }

  function scrollToSelectedIndex(index: number) {
    if (!flatListRef.current) return;
    const layout = itemLayoutsRef.current[index];
    const containerW = containerWidthRef.current || 0;
    if (layout && containerW) {
      const target = layout.x + layout.width / 2 - containerW / 2;
      const maxOffset = Math.max(0, contentWidthRef.current - containerW);
      const offset = clamp(target, 0, maxOffset);
      try {
        flatListRef.current.scrollToOffset({ offset, animated: true });
      } catch (e) {
        // fallback to scrollToIndex if available
        try {
          flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
        } catch (e2) {
          // ignore
        }
      }
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <ThemedView style={styles.themedViewContainer}>
          <ScrollView
            style={styles.rootContainer}
            showsVerticalScrollIndicator={false}
          >
            <ThemedView style={{ height: '100%' }}>
              <ThemedView style={{ position: 'relative' }}>

                <Image
                  source={require("@/assets/images/parent/parent-back-pattern.png")}
                  style={styles.backPattern}
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

                      <IconList width={21} height={21} />
                    </ThemedView>
                    <ThemedText style={styles.dropdownText}>
                      {activeItem}
                    </ThemedText>
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
                          onPress={() => handleItemSelection(option)}
                        >
                          <ThemedView
                            style={[
                              { padding: 3 },
                              option === activeItem && styles.ActiveItemStyle,
                            ]}
                          >
                            <IconList
                              color={
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

                {/* Category pills with scroll-to-selected and drag-to-scroll support */}
                <ThemedView
                  style={styles.categoryPillsContainer}
                  onLayout={(e: any) => {
                    containerWidthRef.current = e.nativeEvent.layout.width;
                    // try to position to selected after container measured
                    if (currentSeries) {
                      const idx = categories.findIndex((c) => (c as any).name === (currentSeries as any).name);
                      if (idx >= 0) scrollToSelectedIndex(idx);
                    }
                  }}
                  // enable responder for mouse drag on web
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={(e: any) => {
                    dragStartXRef.current = e.nativeEvent.pageX;
                    dragStartOffsetRef.current = lastScrollOffsetRef.current || 0;
                  }}
                  onResponderMove={(e: any) => {
                    const dx = e.nativeEvent.pageX - dragStartXRef.current;
                    const offset = clamp(dragStartOffsetRef.current - dx, 0, Math.max(0, contentWidthRef.current - (containerWidthRef.current || 0)));
                    if (flatListRef.current && typeof flatListRef.current.scrollToOffset === "function") {
                      flatListRef.current.scrollToOffset({ offset, animated: false });
                    }
                  }}
                >
                  <FlatList
                    ref={flatListRef}
                    horizontal
                    data={categories.map((ele) => ele)}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={() => handleStoryItem(item.name)}>
                        <ThemedView
                          onLayout={(e: any) => handleItemLayout(e.nativeEvent.layout, index)}
                          style={[
                            styles.categoryPill,
                            currentSeries && (currentSeries as any).name === item.name
                              ? styles.categoryPillActive
                              : styles.categoryPillInactive,
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.categoryText,
                              currentSeries &&
                                (currentSeries as any).name === item.name
                                ? { color: "rgba(5, 59, 74, 1)" }
                                : null,
                            ]}
                          >
                            {item.name}
                          </ThemedText>
                        </ThemedView>
                      </TouchableOpacity>
                    )}
                    style={{}}
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => {
                      lastScrollOffsetRef.current = e.nativeEvent.contentOffset.x;
                    }}
                    scrollEventThrottle={16}
                    // preserve initial measurements on content changes
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={[styles.bottomPadding, { height: '80%' }]}>
                {/* Continue Watching */}
                <ItemListWidthBadge seriesCategories={categories} loading={loading} />
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
            <BottomNavBar role="parent" active="Learning" subActive="Library" />
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

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
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectiondesc}>{desc}</ThemedText>
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
  rootContainer: {
    flex: 1,
    backgroundColor: "rgba(5, 59, 74, 1)",
    position: "relative",
    paddingBottom: 60,
    height: '100%'
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
  backPattern: {
    width: "100%",
    height: "100%",
    position: 'absolute',
    top: 0,
    left: 0,
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
    display: "flex",
    height: 500,
  },
  themedViewContainer: {
    flex: 1,
    flexDirection: 'column',
    position: "relative",
    height: '100%'
  },
  scrollViewContent: {
    paddingBottom: 55,
    position: 'relative'
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
    width: '100%',
    height: '100%'
  },
  arrowIcon: {
    tintColor: "#F4A672",
    marginRight: 16,
    marginBottom: 10,
  },
  horizontalScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
  },
  horizontalScrollContainer: {
    gap: 20,
    paddingHorizontal: 16,
  },
});
