import supabase from "@/app/lib/supabase";
import { useUser } from "@/app/lib/UserContext";
import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import { ItemWithImage } from "@/components/ListItems";
import LearningModeScreen from "@/components/Modals/LearningModeScreen";
import { ModeList } from "@/components/ModeList";
import Recommend from "@/components/parent/dashboard/Recommend";
import RecentLearning from "@/components/parent/dashboard/StoryCarousel";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { modesData } from "@/data/parent/dashboardData";
import { useChildrenStore } from "@/store/childrenStore";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import IconLearning from "@/assets/images/parent/footer/icon-learning.svg";
import IconHeart from "@/assets/images/parent/footer/icon-heart.svg"
import IconStar from "@/assets/images/icons/icon-star.svg"
import IconInformation from "@/assets/images/parent/icon-information.svg"
import IconParentStars from "@/assets/images/icons/icon-dashboard-stars.svg"
import IconClock from "@/assets/images/parent/icon-clock.svg"
import IconLibrary from "@/assets/images/parent/icon-library.svg"
import IconFinished from "@/assets/images/parent/icon-finished.svg"


const InsightItemsDataForDaily: InsightItemProps[] = [
  {
    value: 48,
    what: "Total Story Time",
    avatar: IconClock,
  },
  {
    value: 5,
    what: "Total Pathway Steps Finished",
    avatar: IconLibrary,
  },
  {
    value: 5,
    what: "Total Stories Finished",
    avatar: IconFinished,
  },
];


const InsightItemsDataForWeek: InsightItemProps[] = [
  {
    value: 48,
    what: "Total Story Time",
    avatar: IconClock,
  },
  {
    value: 5,
    what: "Total Pathway Steps Finished",
    avatar: IconLibrary,
  },
  {
    value: 5,
    what: "Total Stories Finished",
    avatar: IconFinished,
  },
];


const windowWidth = Dimensions.get('window').width;

export default function ParentDashboard() {

  const { user } = useUser();
  const children = useChildrenStore((state: any) => state.children);
  const setChildren = useChildrenStore((state: any) => state.setChildren);
  const [modalVisible, setModalVisible] = React.useState(false);
  const activeChild = useChildrenStore((state: any) => state.activeChild);
  const setActiveChild = useChildrenStore((state: any) => state.setActiveChild);
  const [loading, setLoading] = React.useState(false);
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);

  useEffect(() => {
    // Fetch children data from Supabase edge function and sync Zustand store
    async function fetchChildren() {
      if (!user?.id) return;
      setLoading(true); // Start loading
      const jwt =
        supabase.auth.getSession &&
        (await supabase.auth.getSession())?.data?.session?.access_token;
      const { data, error } = await supabase.functions.invoke("children", {
        method: "GET",
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : "",
        },
      });
      if (error) {
        setLoading(false); // Stop loading
        console.error("Error fetching children:", error.message);
        return;
      }
      if (data && Array.isArray(data.data)) {
        setLoading(false); // Stop loading
        setChildren(data.data);
        setActiveChild(data.data[0]);
      }
    }

    fetchChildren();
  }, []);

  const handleChildSelect = (child: any) => {
    setActiveChild(child);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <LearningModeScreen onCancel={() => setModalVisible(false)} />
      </Modal>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={{ flex: 1, display: "flex", position: "relative" }}>
          <ScrollView
            style={styles.rootContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 55 }}
          >
            {/* Top background */}
            <Image
              source={require("@/assets/images/parent/dashboard/dashboard-back-pattern.png")}
              style={styles.topBackPattern}
              contentFit="cover"
            />
            <Image
              source={require("@/assets/images/parent/frontbox.png")}
              style={styles.frontBox}
              contentFit="cover"
            />

            {/* Main Content */}
            <Header role="parent"></Header>
            {/* Header */}

            <ThemedView style={styles.headerRocketWrap}>
              <IconParentStars
                width={75}
                height={130}
                style={styles.headerRocket}
              />
              {/* Clouds */}
              <Image
                style={styles.imgCloudFar}
                source={require("@/assets/images/parent/cloud-group-far.png")}
                contentFit="fill"
              />
              <Image
                style={styles.imgCloudNear}
                source={require("@/assets/images/parent/cloud-group-near.png")}
                contentFit="fill"
              />
            </ThemedView>
            {loading ? (
              <ActivityIndicator color="#ffffff" style={{ zIndex: 999 }} />
            ) : children?.length > 0 ? (
              <ThemedView
                style={{ marginTop: -120, marginBottom: 70, zIndex: 100 }}
              >
                {/* Children Tab */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardScrollContainer}
                >
                  {children.map((item: any, idx: any) => (
                    <ItemWithImage
                      key={idx}
                      name={item.name}
                      avatar={item.avatar_url}
                      active={activeChild?.name == item.name}
                      onPress={() => handleChildSelect(item)}
                    />
                  ))}
                </ScrollView>

                <ThemedView style={[{ marginTop: 50 }, styles.btnRow]}>
                  <SectionHeader title="Learning Mode" avatar={IconLearning} />
                  <TouchableOpacity
                    style={{ marginBottom: 20 }}
                    onPress={() => setModalVisible(true)}
                  >
                    <IconInformation width={24} height={24} color={"#7AC1C6"}/>
                  </TouchableOpacity>
                </ThemedView>
                <ThemedView style={styles.modesStyle}>
                  <ModeList
                    active={activeChild}
                    selectActiveChild={setActiveChild}
                  />
                </ThemedView>

                <SectionHeader title="Recent Learning" avatar={IconLearning} />
                <RecentLearning activeChild={activeChild} />

                {/* Recommended */}
                <SectionHeader title="Recommended" avatar={IconHeart} />
                <Recommend activeChild={activeChild} />

                {/* Featured Adventures */}
                <SectionHeader title="Insights" avatar={IconStar} />

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onScroll={event => {
                    const x = event.nativeEvent.contentOffset.x;
                    const cardWidth = windowWidth; // card width + gap (adjust if needed)
                    const index = Math.round(x / cardWidth);
                    setCurrentCardIndex(index);
                  }}
                  scrollEventThrottle={16}
                >
                  <ThemedView style={{ flexDirection: 'row' }}>
                    <ThemedView style={[styles.insightStyles, { width: windowWidth }]}>
                      <ThemedText
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "rgba(173,215,218,1)",
                        }}
                      >
                        Daily
                      </ThemedText>
                      {InsightItemsDataForDaily?.map((item, index) => {
                        return (
                          <InsightItem
                            key={index}
                            value={item.value}
                            what={item.what}
                            avatar={item.avatar}
                          />
                        );
                      })}
                    </ThemedView>

                    <ThemedView style={[styles.insightStyles, { width: windowWidth }]}>
                      <ThemedText
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "rgba(173,215,218,1)",
                        }}
                      >
                        Weekly
                      </ThemedText>
                      {InsightItemsDataForWeek?.map((item, index) => {
                        return (
                          <InsightItem
                            key={index}
                            value={item.value}
                            what={item.what}
                            avatar={item.avatar}
                          />
                        );
                      })}
                    </ThemedView>
                  </ThemedView>
                </ScrollView>

                <ThemedView style={[styles.pagination, { marginTop: 10 }]}>
                  <ThemedView style={currentCardIndex == 0 ? styles.activeDot : styles.dot} />
                  <ThemedView style={currentCardIndex == 1 ? styles.activeDot : styles.dot} />
                </ThemedView>

              </ThemedView>
            ) : (
              <ThemedView
                style={{
                  marginTop: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999,
                }}
              >
                <ThemedText
                  style={{ fontSize: 18, color: "#ffffff", marginBottom: 16 }}
                >
                  No children data
                </ThemedText>
                <Link href="/(parent)/(profiles)/(account)">
                  <ThemedText
                    style={{
                      textDecorationLine: "underline",
                      color: "#F4A672",
                      fontStyle: "italic",
                      fontSize: 16,
                    }}
                  >
                    Go to Profile Settings
                  </ThemedText>
                </Link>
              </ThemedView>
            )}
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
            <BottomNavBar role="parent" active="Dashboard" />
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

type SectionHeaderProps = {
  title: string;
  avatar: any;
  avatar1?: any;
};

type InsightItemProps = {
  value: number;
  what: string;
  avatar: any;
};

export function SectionHeader({ title, avatar, avatar1 }: SectionHeaderProps) {
  return (
    <ThemedView style={styles.sectionHeader}>
      {
        React.createElement(avatar, { width: 24, height: 24, color: "#7AC1C6", style: { marginRight: 4 } })
      }
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>

      {
        avatar1 && React.createElement(avatar1, { width: 24, height: 24, color: "#7AC1C6", style: { marginRight: 4 } })
      }
    </ThemedView>
  );
}

function InsightItem({ value, what, avatar: Avatar }: InsightItemProps) {
  return (
    <ThemedView style={styles.insightItem}>
      <ThemedView
        style={{
          padding: 20,
          borderRadius: 25,
          borderWidth: 1, // Thickness of the border
          borderColor: "rgba(252, 252, 252, 0.2)",
          borderStyle: "solid",
        }}
      >
        <Avatar
          width={24}
          height={24}
          style={styles.logodown}
        />
      </ThemedView>
      <ThemedView style={{ display: "flex", flexDirection: "column" }}>
        <ThemedText style={styles.itemValue}>{value}</ThemedText>
        <ThemedText style={styles.itemWhat}>{what}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  myText: {
    fontFamily: "Sintara-Bold",
    fontSize: 18,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: "#ADD7DA",
    position: "relative",
  },
  topBackPattern: {
    width: "100%",
    height: 400,
    position: "absolute",
  },
  frontBox: {
    position: "absolute",
    top: 225,
    zIndex: 1,
    width: "100%",
    height: 2157,
  },
  headingWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 23,
  },
  logoBallon: { width: 36, height: 36 },
  logoParent: { width: 48, height: 48 },
  logodown: { width: 24, height: 24 },
  headerWrap: {
    marginTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
  },
  headerStar: {
    width: 32,
    height: 34,
    marginLeft: 8,
  },
  headerSubtitle: {
    color: "#053B4A",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 24.3,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  headerRocket: { zIndex: -1 },
  headerRocketWrap: {
    display: "flex",
    width: "100%",
    height: 300,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    zIndex: -1,
  },
  imgCloudFar: {
    width: "112%",
    height: "100%",
    position: "absolute",
    top: -40,
    left: -37.5,
    zIndex: -100,
  },
  imgCloudNear: {
    width: "112%",
    height: "100%",
    position: "absolute",
    top: 10,
    left: -20,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
  },
  sectionTitle: {
    fontFamily: "Sintara-Bold",
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectionArrow: {
    width: 24,
    height: 24,
  },
  cardScrollContainer: {
    gap: 20,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  insightItem: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 15,
    borderWidth: 1, // Thickness of the border
    borderColor: "rgba(252, 252, 252, 0.2)",
    borderStyle: "solid",
    borderRadius: 20,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  informationBtn: {
    width: 24,
    height: 24,
  },
  itemValue: {
    fontSize: 24,
    color: "rgba(252, 252, 252, 1)",
    fontWeight: 700,
  },
  itemWhat: {
    fontSize: 14,
    fontWeight: 400,
    color: "rgba(122, 193, 198, 1)",
  },
  insightStyles: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  modesStyle: {
    marginBottom: 60,
    marginHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  modeItemStyle: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 50,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: "rgba(122, 193, 198, 1)",
    margin: 4,
  },
  activeDot: {
    backgroundColor: "rgba(122, 193, 198, 1)",
    width: 10,
    height: 10,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: "rgba(122, 193, 198, 1)",
    margin: 4,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
