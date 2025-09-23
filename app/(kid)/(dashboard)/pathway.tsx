import { useUser } from "@/app/lib/UserContext";
import BottomNavBar from "@/components/BottomNavBar";
import { StoryCard2 } from "@/components/Cards";
import PathwayProgressBar from "@/components/PathwayProgressBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { RelativePathString, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Header from "@/components/Header";
import supabase from "@/app/lib/supabase";
import { usePathwayStore } from "@/store/pathwayStore";
import PathwayList from "@/components/kid/dashboard/PathwayList";

import IconStar from "@/assets/images/icons/icon-mark-modal.svg";
import IconRocket from "@/assets/images/icons/icon-rocket.svg";
import useIsMobile from "@/hooks/useIsMobile";
// Data arrays for each section

export default function PathwayModeHome() {
  const isMobile = useIsMobile();
  const { child } = useUser();
  const [name, setName] = useState("");
  const pathways = usePathwayStore((state) => state.pathways);
  const setPathways = usePathwayStore((state) => state.setPathways);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPathways() {
      setLoading(true);
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const childId = child?.id;
        if (!childId) return;
        const res = await fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/pathway-modes/child/${childId}`, {
          headers: {
            Authorization: `Bearer ${jwt}` // if needed
          }
        });
        const data = await res.json();
        setPathways(data);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    if (child) {
      fetchPathways();
      setName(child?.name || "");
    }
  }, [child]);

  return (
    <SafeAreaView style={{ flex: 1, display: "flex", height: 500 }}>
      <ThemedView style={{ flex: 1, display: "flex", position: "relative" }}>
        <ScrollView
          style={styles.rootContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 78 }}
        >
          {/* Top background */}
          <Image
            source={require("@/assets/images/auth/back-pattern.png")}
            style={styles.topBackPattern}
            contentFit="cover"
          />
          <Header role="kid" mode="pathway" />
          {/* Header */}
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

          {/* Pathway Section */}
          <ThemedView style={{ height: '100%', backgroundColor: "#fcfcfc", marginTop: -50, paddingHorizontal: 12 }}>
            {
              pathways && pathways.length > 0 && pathways.map((pathway, idx) => (
                <PathwayList key={idx} pathway={pathway} />
              ))
            }
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
          <BottomNavBar active="Dashboard" theme="light" image={true} pathway={true} />
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#F4A672",
    position: "relative",
  },
  topBackPattern: {
    width: "100%",
    height: 400,
    position: "absolute",
  },
  headingWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 23,
  },
  logoBallon: { width: 48, height: 48 },
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
  imgCloudTablet: {
    width: '105%',
    height: '100%',
    position: "absolute",
    top: 50,
    left: 0,
    zIndex: -100,
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
  pathwayTitle: {
    color: "#053B4A",
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 37.5,
    textAlign: "center",
  },
  pathwaySubTitle: {
    color: "#053B4A80",
    fontSize: 20,
    fontWeight: 400,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 24,
  },
  sectionHeaderLink: {
    marginTop: 10,
    marginBottom: 10,
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
  sectionSubTitle: {
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 21.68,
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
});
