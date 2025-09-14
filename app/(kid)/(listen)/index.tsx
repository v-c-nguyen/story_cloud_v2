import supabase from "@/app/lib/supabase";
import { useUser } from "@/app/lib/UserContext";
import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import { ItemWithImage } from "@/components/ListItems";
import WatchNext from "@/components/parent/dashboard/WatchNext";
import SeriesCarousel from "@/components/SeriesCarosel";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { modesData } from "@/data/parent/dashboardData";
import { useChildrenStore } from "@/store/childrenStore";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

export default function ParentListen() {
  const children = useChildrenStore((state: any) => state.children);
  const setChildren = useChildrenStore((state: any) => state.setChildren);
  const { child } = useUser();
  const { user } = useUser();
  const [loading, setLoading] = React.useState(false);
  const { activeChild, setActiveChild } = useChildrenStore();

  useEffect(() => {
    if(child)
      setActiveChild(child);
  }, [child])

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, display: "flex", height: 500 }}>
        <ThemedView style={{ flex: 1, display: "flex", position: "relative" }}>
          <ScrollView
            style={styles.rootContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 55 }}
          >
            {/* Top background */}
            <Image
              source={require("@/assets/images/parent/top-back-pattern.png")}
              style={styles.topBackPattern}
              contentFit="cover"
            />

            {/* Main Content */}
            <Header role="kid" theme="dark" mode={child?.mode}></Header>
            {/* Header */}

            <ThemedView style={styles.container}>
              <ThemedText style={styles.header}>Continue Playing</ThemedText>

              {activeChild && (
                <SeriesCarousel
                  mode={"parent"}
                  activeChild={activeChild}
                />
              )}

              <ThemedText style={styles.subTitle}>Watch Next</ThemedText>
              <WatchNext activeChild={activeChild} />
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
            <BottomNavBar
              role="kid"
              active="Listen"
              theme="light"
              image={true}
              pathway={child?.mode == "pathway"}
            />
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  myText: {
    fontFamily: "Sintara-Bold",
    fontSize: 18,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: "rgba(5, 59, 74, 1)",
    position: "relative",
  },
  topBackPattern: {
    width: "100%",
    height: "100%",
    maxHeight: 1200,
    position: "absolute",
  },
  container: {
    marginTop: 60,
    zIndex: 100,
    paddingHorizontal: 16,
  },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 30,
    marginBottom: 30,
  },
  subTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 30,
    marginBottom: 20,
    marginTop: 60,
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
  headerRocket: { width: 74.68, height: 130.21, zIndex: -1 },
  headerRocketWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    zIndex: -1,
  },
  imgCloudFar: {
    width: 427,
    height: 200,
    position: "absolute",
    top: 0,
    left: -37.5,
    zIndex: -100,
  },
  imgCloudNear: {
    width: 427,
    height: 220,
    position: "absolute",
    top: 37,
    left: -20,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 8,
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
    gap: 10,
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
    marginTop: 20,
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
});
