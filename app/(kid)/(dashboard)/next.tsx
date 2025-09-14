import BottomNavBar from "@/components/BottomNavBar";
import { SeriesCard } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Stack } from "expo-router";
import React, { use } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet
} from "react-native";
import { Image } from "expo-image";

import IconArrowLeft from "@/assets/images/icons/arrow-left.svg";
import Header from "@/components/Header";
import { useUser } from "@/app/lib/UserContext";

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

export default function WatchNextScreen() {
  const { child } = useUser();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.rootContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top background */}
          <Image
            source={require("@/assets/images/kid/back-pattern.png")}
            style={styles.topBackPattern}
            contentFit="cover"
          />
          <Header role="kid" mode={child?.mode} />
          {/* Header */}
          <ThemedText style={styles.headerTitle}>Watch Next</ThemedText>

          <ThemedView style={styles.headerCloudWrap}>
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

            <Link href="../">
              <ThemedView style={[styles.backWrap]}>
                  <IconArrowLeft
                    width={24}
                    height={24}
                    color={"#fcfcfc"}
                  />
                <ThemedText style={styles.backText}>Back to Dashboard</ThemedText>
              </ThemedView>

            </Link>

          </ThemedView>
          {/* Story List */}
          <ThemedView
            style={{
              backgroundColor: "#fcfcfc",
              marginTop: -4,
              minHeight: '100%',
              paddingBottom: 50,
              marginBottom: 40,
              flex: 1,
            }}
          >
            <ThemedView style={{ paddingLeft: 16 }}>
              {seriesData.length > 0 && seriesData.map((item, index) => (
                <ThemedView key={index} style={styles.cardWrap}>
                  <SeriesCard {...item} />
                </ThemedView>
              ))}
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
    position: "absolute",
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
  imgArrowLeft: {
    width: 20,
    height: 20,
  },
  backText: {
    color: "#053B4A",
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
});
