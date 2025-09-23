import { useUser } from "@/app/lib/UserContext";
import BottomNavBar from "@/components/BottomNavBar";
import { SeriesCard, StoryCard2 } from "@/components/Cards";
import Recommend from "@/components/parent/dashboard/Recommend";
import RecentLearning from "@/components/parent/dashboard/StoryCarousel";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { RelativePathString, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import IconStar from "@/assets/images/icons/icon-mark-modal.svg";
import IconRocket from "@/assets/images/icons/icon-rocket.svg";
import IconArrowRight from "@/assets/images/icons/arrow-right.svg";
import Header from "@/components/Header";
import useIsMobile from "@/hooks/useIsMobile";
// Data arrays for each section

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

export default function FreeModeHome() {
  const isMobile = useIsMobile(); ''
  const router = useRouter();
  const { child } = useUser();
  const [name, setName] = useState(child?.name || "");
  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <>
      <Stack.Screen options={{
        headerShown: false
      }} />
      <SafeAreaView style={{ flex: 1, display: "flex", height: 500 }}>
        <ThemedView style={{ flex: 1, display: "flex", position: "relative", height: "100%" }}>
          <ScrollView
            style={styles.rootContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 55 }}
          >

            {/* Top background */}
            <Image
              source={require("@/assets/images/auth/back-pattern.png")}
              style={styles.topBackPattern}
              contentFit="cover"
            />
            <ThemedView style={showSignOut && { backgroundColor: "#fff" }}>
              <Header role="kid" mode={child?.mode}></Header>
            </ThemedView>
            {/* Header */}
            {
              showSignOut ? <>
                <ThemedView style={[styles.headerWrap, { backgroundColor: "#fff", marginBottom: 140 }]}>
                  <TouchableOpacity
                    style={[styles.signOutButton]}
                    onPress={() => console.log("Sign Out")}
                  >
                    <Ionicons
                      name="log-out"
                      size={24}
                      color="#053B4A"
                    />
                    <ThemedText style={{ color: "#053B4A", fontSize: 18, marginLeft: 8 }}>
                      Sign Out
                    </ThemedText>
                  </TouchableOpacity>
                  <Image
                    source={require("@/assets/images/kid/cloud-group-bottom.png")}
                    style={[styles.imgCloudFar, { transform: [{ rotate: '180deg' }] }]}
                    contentFit="cover"
                  />
                </ThemedView>
              </> :
                <>
                  <ThemedView style={styles.headerWrap}>
                    <ThemedText style={styles.headerTitle}>Hey, {name}</ThemedText>
                    <IconStar
                      width={84}
                      height={90}
                      style={styles.headerStar}
                    />
                  </ThemedView>
                  <ThemedText style={styles.headerSubtitle}>
                    Let’s watch something and have fun!
                  </ThemedText>
                </>
            }
            {isMobile &&
              <ThemedView style={styles.headerRocketWrap}>
                <IconRocket
                  width={224.54}
                  height={287}
                  style={styles.headerRocket}
                />
                {/* Clouds */}
                <Image
                  source={require("@/assets/images/kid/cloud-group-far.png")}
                  style={styles.imgCloudFar}
                  contentFit="cover"
                />
                <Image
                  source={require("@/assets/images/kid/cloud-group-near.png")}
                  style={styles.imgCloudNear}
                  contentFit="cover"
                />
              </ThemedView>
            }
            {!isMobile &&
              <ThemedView style={styles.headerRocketWrap}>
                <IconRocket
                  width={224.54}
                  height={287}
                  style={styles.headerRocket}
                />
                {/* Clouds */}
                <Image
                  source={require("@/assets/images/kid/cloud-group.png")}
                  style={styles.imgCloudTablet}
                  contentFit="fill"
                />
              </ThemedView>
            }

            <ThemedView style={{ backgroundColor: "#fcfcfc", marginTop: -26, paddingBottom: 100 }}>
              {/* Continue Watching */}
              <SectionHeader title="Continue Watching" link="continue" />
              <RecentLearning activeChild={child} mode="kid" />

              {/* Watch Next */}
              <SectionHeader title="Watch Next" link="next" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardScrollContainer}
              >
                {seriesData.map((item, idx) => (
                  <SeriesCard key={idx} {...item} />
                ))}
              </ScrollView>

              {/* Featured Adventures */}
              <SectionHeader title="Featured Adventures" link="featured" />
              <Recommend activeChild={child} mode="kid" />

              {/* Just Watched */}
              <SectionHeader title="Just Watched" link="watched" />
              <RecentLearning activeChild={child} mode="kid" watched={true} />

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
            <BottomNavBar active="Dashboard" theme="light" image={true} />
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

function SectionHeader({ title, link }: { title: string; link: string }) {

  const router = useRouter();
  // Helper for route path
  const getRoute = () => {

    return `./${link}`;
  };
  return (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <TouchableOpacity onPress={() => router.push(getRoute() as RelativePathString)}>
        <IconArrowRight
          width={24}
          height={24}
          color={"#048F99"}
          style={styles.sectionArrow}
        />
      </TouchableOpacity>
    </ThemedView>

  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "rgba(248, 236, 174, 1)",
    position: "relative",
  },
  topBackPattern: {
    width: "100%",
    height: 400,
    position: "absolute",
  },
  headerWrap: {
    paddingTop: 40,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imgCloudTablet: {
    width: '105%',
    height: '100%',
    position: "absolute",
    top: 50,
    left: 0,
    zIndex: -100,
  },
  headerTitle: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
  },
  headerStar: {
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
  headerRocket: { width: 224.54, height: 287 },
  headerRocketWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 36,
    marginTop: -56,
    position: "relative",
  },
  imgCloudFar: {
    width: "110%",
    height: 278,
    position: "absolute",
    top: 58,
    left: 0,
    zIndex: -100,
  },
  imgCloudNear: {
    width: "100%",
    height: 279,
    position: "absolute",
    top: 100,
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
    color: "#053B4A",
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
    paddingBottom: 60,
  },
  logoBallon: {
    width: 48,
    height: 48,
  },
  headingWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 23,
  },
  signOutButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#053B4A",
  },
});