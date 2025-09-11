import BottomNavBar from "@/components/BottomNavBar";
import { StoryCard2 } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useStoryStore } from "@/store/storyStore";
import { Link, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from "react-native";


export default function ContinueScreen() {
  const recentStories = useStoryStore((state) => state.recentStories);
  const [storiesData, setStoriesData] = useState<any>([]);

  useEffect(() => {
    if (recentStories && recentStories.length > 0) {
      setStoriesData(recentStories.filter(((recent: any) => recent?.watched == false)));
    }
  }, [recentStories])
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
          <ThemedText style={styles.headerTitle}>Continue Watching</ThemedText>

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

            <ThemedText style={styles.headerSubtitle}>Stories</ThemedText>
            <ThemedText style={styles.headerCountData}>
              {storiesData.length} TOTAL
            </ThemedText>
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
            <ThemedView style={styles.backWrap}>
              <Link href="../">
                <Image
                  source={require("@/assets/images/kid/arrow-left.png")}
                  style={styles.imgArrowLeft}
                  resizeMode="cover"
                />
              </Link>
              <ThemedText style={styles.backText}>Back to Dashboard</ThemedText>
            </ThemedView>

            <ThemedView style={{ paddingLeft: 16 }}>
              {storiesData.length > 0 && storiesData.map((item: any, index: number) => (
                <ThemedView key={index} style={styles.cardWrap}>
                  <StoryCard2 {...item} />
                </ThemedView>
              ))}
              {
                storiesData.length <= 0 &&
                <ThemedText style={{ color: '#053B4A', textAlign: 'center', marginTop: 60 }}>no recent data</ThemedText>
              }
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
    height: "100%",
    maxHeight: 1200,
    position: "absolute",
    top: 0,
    left: 0,
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
  headerSubtitle: {
    color: "#053B4A",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32.4,
    textAlign: "center",
    marginTop: 82,
    marginBottom: 20,
  },
  headerCountData: {
    color: "#048F99",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center",
    marginTop: 0,
    marginBottom: 30,
  },
  backWrap: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  cardWrap: {
    marginBottom: 16,
    alignItems: "center",
  }
});