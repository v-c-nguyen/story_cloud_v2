import React, { useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StoryCard2 } from "@/components/Cards";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Touchable,
} from "react-native";
import StoryItems from "./StoryItems";
import { useStoryStore } from "@/store/storyStore";
import { useSeriesStore } from "@/store/seriesStore";
import normalize from "@/app/lib/normalize";

import IconArrowLeft from "@/assets/images/icons/arrow-left.svg";
import IconCheck from "@/assets/images/parent/icon-check.svg"


interface Props {
  currentCharacter: any;
  setCurrentCharacter?: (c: any) => void;
}

export default function CharacterSelection({
  currentCharacter,
  setCurrentCharacter,
}: Props) {
  const router = useRouter();
  const stories = useStoryStore((state) => state.stories);
  const series = useSeriesStore((state) => state.series);
  const [selectedItem, setSelectedItem] = React.useState<string>("all");
  return (
    <ThemedView style={styles.selectionContainer}>
      <View style={styles.detailsSection}>
        <View style={styles.selectionHeaderRow}>
          <View style={{margin: "auto"}}>
            <Image
              source={
                (currentCharacter as any)?.avatar_url
                  ? { uri: currentCharacter.avatar_url }
                  : require("@/assets/images/avatars/dano_badger.png")
              }
              style={[styles.avatarImg]}
            />
            <ThemedText
              style={[
                styles.sectionTitle,
                styles.selectionTitleLarge,
                { lineHeight: 40, textAlign: "center" },
              ]}
            >
              {(currentCharacter as any)?.name}
            </ThemedText>
            <ThemedText
              style={[styles.sectionTitle, styles.selectionTitleSmall]}
            >
              {(currentCharacter as any)?.description ??
                currentCharacter?.description_parent}
            </ThemedText>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={() => setSelectedItem("all")}>
            <View style={styles.statsIconContainer}>
              {selectedItem === "all" && (
                <IconCheck
                  width={14}
                  height={14}
                  color={"#F4A672"}
                />
              )}
              <ThemedText
                style={[
                  styles.statsText,
                  selectedItem === "all" && styles.statsTextOrange,
                ]}
              >
                ALL
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setSelectedItem("series")}>
            <View style={styles.statsIconContainer}>
              {selectedItem === "series" && (
                <IconCheck
                  width={14}
                  height={14}
                  color={"#F4A672"}
                />
              )}
              <ThemedText
                style={[
                  styles.statsText,
                  selectedItem === "series" && styles.statsTextOrange,
                ]}
              >
                {currentCharacter.series ? currentCharacter.series.length : 0} SERIES
              </ThemedText>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity onPress={() => setSelectedItem("stories")}>
            <View style={styles.statsIconContainer}>
              {selectedItem === "stories" && (
                <IconCheck
                  width={14}
                  height={14}
                  color={"#F4A672"}
                />
              )}
              <ThemedText
                style={[
                  styles.statsText,
                  selectedItem === "stories" && styles.statsTextOrange,
                ]}
              >
                {currentCharacter.stories ? currentCharacter.stories.length : 0} STORIES
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "#d0d0d08c", margin: 'auto', marginVertical: 20, height: 1, width: 230 }}></View>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}
          onPress={() => setCurrentCharacter && setCurrentCharacter(null)}
        >
                  <IconArrowLeft
                    width={24}
                    height={24}
                    color={"#053B4A"}
                  />
          <ThemedText style={[styles.backButtonText, { marginTop: 0, marginBottom: 0 }]}>{"Back to Storyland Map"}</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScrollContent}
      >
        <StoryItems
          seriesCategory={currentCharacter?.name}
          tag="characters"
          mode="parent"
          direction="vertical"
          filter={selectedItem}
          charactersData={currentCharacter}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    paddingBottom: 120,
    alignItems: "center",
    borderRadius: 20,
  },
  backButtonText: {
    color: "#053B4A",
    fontSize: 18,
    marginTop: 30,
    paddingHorizontal: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  detailsSection: {
    marginBottom: 5,
    width: "100%",
    marginTop: 25,
  },
  selectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  avatarImg: {
    height: 232,
    width: 232,
    margin: 'auto'
  },
  sectionTitle: {
    color: "#053B4A",
    fontSize: 24,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  selectionTitleLarge: {
    marginTop: 0,
    fontSize: 24,
  },
  selectionTitleSmall: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "400",
    textAlign: 'center'
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
    justifyContent: "center",
  },
  statsText: {
    color: "#048F99",
    fontWeight: "600",
    fontSize: 18,
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
    fontWeight: "600",
    fontSize: 18,
  },
  cardScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
    paddingLeft: 30,
    paddingTop: 30,
  },
});
