import supabase from "@/app/lib/supabase";
import { fetchPathways } from "@/app/lib/supabasePathways";
import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import { CreatPathwayModal } from "@/components/Modals";
import { PathwayCard } from "@/components/PathwayCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { categoryData, storyOptionsData } from "@/data/libraryData";
import { useLearningCategoryStore } from "@/store/learningCategoryStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Define PathwayTarget type if not imported
type PathwayTarget = {
  learning_categories: {
    name: string;
    [key: string]: any;
  };
  [key: string]: any;
};

type Pathway = {
  created_at: string,
  description: string,
  id: number,
  name: string,
  parent_id: string,
  pathway_targets: PathwayTarget[]
  [key: string]: any;
};

import IconSwap from "@/assets/images/icons/icon-swap.svg";
import IconPlus from "@/assets/images/parent/icon-plus.svg";
import IconLearning from "@/assets/images/parent/footer/icon-learning.svg";
import IconSearch from "@/assets/images/icons/icon-search.svg";
import useIsMobile from "@/hooks/useIsMobile";
import LearningTab from "@/components/LearningTab";

const HIGHLIGHT_INDEX = 0;
export default function Index() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [modalVisible, setModalVisible] = React.useState(
    params.showModal === "true"
  );
  const [activeItem, setActiveItem] = React.useState("Stories");
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const { categories, setCategories } = useLearningCategoryStore();
  const [pathways, setPathways] = useState<any[]>([]);
  const [displayModes, setDisplayModes] = useState<Pathway[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await fetchPathways();
        setPathways(data);
        setDisplayModes(data);
      } catch (e) {
        console.error("Error fetching pathways:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchLearningTargets() {
      setLoading(true);
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke('learning_categories', {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching learning categories:', error.message);
        } else if (data && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (e) {
        console.error('Error fetching learning categories:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchLearningTargets();
  }, [setCategories]);

  useEffect(() => {
    if (selectedSeries) {
      const filtered = pathways.filter((pathway) => {
        const targets = pathway.pathway_targets || [];
        return targets.some((target: PathwayTarget) => target.learning_categories.name === selectedSeries)
      });
      setDisplayModes(filtered);
    }
    else {
      setDisplayModes(pathways);
    }
  }, [selectedSeries])
  function handleItemSelection(item: string) {
    setActiveItem(item);
    setDropdownVisible(false);
  }

  function handleStoryItem(item: string) {
    if (selectedSeries === item)
      setSelectedSeries(null)
    else
      setSelectedSeries(item)
  }

  function CreateNewPathway() {
    router.push("./new_pathway");
  }

  function removeModal() {
    setModalVisible(false);
    // router.replace('parent/learning/pathway')
  }
  function handleViewButton(id: string) {
    router.replace(`./view_pathway?id=${id}`);
  }

  function handleEditButton(id: string) {
    router.replace(`./edit_pathway?id=${id}`);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, display: "flex", height: 500 }}>
        <ThemedView style={{ flex: 1, display: "flex", position: "relative" }}>
          <ScrollView
            style={[styles.rootContainer]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 55 }}
          >
            {/* Top background */}
            <Image
              source={require("@/assets/images/parent/parent-back-pattern.png")}
              style={[styles.topBackPattern,
              {
                height: displayModes.length <= 0 || loading ? 1000 : 0
              }
              ]}
              resizeMode="cover"
            />

            <ThemedView style={{ position: 'relative' }}>

              <Image
                source={require("@/assets/images/parent/parent-back-pattern.png")}
                style={[styles.topBackPattern,
                {
                  height: displayModes.length > 0 && !loading && displayModes.length > 0 ? '100%' : 0
                }
                ]}
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
                {!isMobile && <LearningTab activeItem="Pathway" />}
                <ThemedView style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: "auto" }}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => router.push("/(parent)/search-screen")}
                  >
                    <IconSearch width={20} height={20} color={"#7AC1C6"} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn}>
                    <IconSwap width={20} height={20} color={"#7AC1C6"} />
                  </TouchableOpacity>

                  {/* Dropdown toggle */}
                  <TouchableOpacity
                    style={styles.dropdownToggle}
                    onPress={CreateNewPathway}
                  >
                    <IconPlus width={18} height={18} color={"rgba(173, 215, 218, 1)"} />
                    <ThemedText style={styles.dropdownText}>
                      {" "}
                      Create New Pathway{" "}
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              {/* Category pills */}
              <FlatList
                horizontal
                data={categories.map((ele) => ele.name)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleStoryItem(item)}>
                    <ThemedView style={[styles.categoryPill, selectedSeries === item ? styles.categoryPillActive : styles.categoryPillInactive]}>
                      <ThemedText style={[styles.categoryText, selectedSeries === item ? { color: 'rgba(5, 59, 74, 1)' } : null]}>{item}</ThemedText>
                    </ThemedView>
                  </TouchableOpacity>
                )}
                style={styles.categoryPillsContainer}
                showsHorizontalScrollIndicator={false}
              />
            </ThemedView>

            <ThemedView style={{ paddingBottom: 100, marginBottom: 50 }}>
              {loading ? (
                <ThemedText>Loading pathways...</ThemedText>
              ) : displayModes.length > 0 ? (
                displayModes.map((pathway, idx) => (
                  <PathwayCard
                    key={pathway.id || idx}
                    pathway={pathway}
                    handleViewButton={handleViewButton}
                    handleEditButton={handleEditButton}
                  />
                ))
              ) : (
                <ThemedText
                  style={{
                    color: "white",
                    textAlign: "center",
                    paddingTop: 150,
                  }}
                >
                  No pathways found.
                </ThemedText>
              )}
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
            <BottomNavBar role="parent" active="Learning" subActive={isMobile ? "Pathway" : ""} image={!isMobile ? true : false} />
          </ThemedView>

          <CreatPathwayModal
            mode={params.mode}
            modalVisible={modalVisible}
            onRemove={removeModal}
          ></CreatPathwayModal>
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
  },
  topBackPattern: {
    width: '100%',
    maxHeight: 1200,
    position: "absolute",
  },
  categoryPillsContainer: {
    paddingHorizontal: 16
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
    padding: 8,
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
  categoryPillActive: {
    backgroundColor: 'rgba(122, 193, 198, 1)'
  },
  categoryPillInactive: {
    backgroundColor: 'rgba(122, 193, 198, 0.2)'
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
    borderRadius: 100,
    padding: 3,
  },
});
