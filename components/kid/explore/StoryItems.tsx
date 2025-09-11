import { SeriesCard2, SeriesCard_Parent, StoryCard1 } from "@/components/Cards";
import { ThemedView } from "@/components/ThemedView";
import { useSeriesStore } from "@/store/seriesStore";
import { useStoryStore } from "@/store/storyStore";
import normalize from "@/app/lib/normalize";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";

interface StoryItemsProps {
  seriesCategory: string;
  tag: string;
  mode: string;
  direction?: string;
  filter?: string;
  seriesData?: any;
  themesData?: any;
  charactersData?: any
}
const StoryItems: React.FC<StoryItemsProps> = ({
  seriesCategory,
  tag,
  mode,
  direction = "horizontal",
  filter = "all",
  seriesData,
  themesData,
  charactersData
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const stories = useStoryStore((state) => state.stories);
  const series = useSeriesStore((state) => state.series);

  // using shared normalize
  return (
    <ThemedView>
      <ScrollView
        horizontal={direction === "horizontal"}
        showsHorizontalScrollIndicator={false}
      >

        {tag == "series" &&
          mode == "kid" &&
            seriesData && seriesData.stories
            .map((item: any, idx: number) => (
              <StoryCard1
                key={idx}
                num={idx + 1}
                story={item}
                onPlay={(storyId: string) =>
                  router.push({
                    pathname: "/(parent)/(listen)/listenStory",
                    params: { storyId },
                  })
                }
              />
            ))}



        {tag == "collections" &&
          mode == "parent" &&
          filter != "series" &&
          stories
            .filter(
              (story) =>
                normalize(story.collections) === normalize(seriesCategory)
            )
            .map((item, idx) => (
              <StoryCard1
                key={idx}
                num={idx + 1}
                story={item}
                onPlay={(storyId: string) =>
                  router.push({
                    pathname: "/(parent)/(listen)/listenStory",
                    params: { storyId },
                  })
                }
              />
            ))}

        {tag == "collections" &&
          mode == "kid" &&
          series
            .filter(
              (story) =>
                normalize(story.collections) === normalize(seriesCategory)
            )
            .map((item, idx) => <SeriesCard_Parent key={idx} series={item} />)}

        {tag == "collections-details" &&
          mode == "kid" &&
          series
            .filter(
              (story) =>
                normalize(story.collections) === normalize(seriesCategory)
            )
            .map((item, idx) => (
              <ThemedView key={idx}>
                <SectionHeader title={item.name} desc={item.description_parent || ""} link="continue" />
                <ScrollView horizontal>

                  {
                    stories
                      .filter(
                        (story) =>
                          Array.isArray(item.episode_order) &&
                          item.episode_order.includes(story.storyId)
                      )
                      .map((item, idx) => (
                        <StoryCard1
                          key={idx}
                          num={idx + 1}
                          story={item} />
                      )
                      )}
                </ScrollView>

              </ThemedView>
            ))}

        {tag == "characters" &&
          mode == "parent" &&
          charactersData && charactersData.stories
            .map((item: any, idx: number) => (
              <StoryCard1
                key={idx}
                num={idx + 1}
                story={item}
                onPlay={(storyId: string) =>
                  router.push({
                    pathname: "/(parent)/(listen)/listenStory",
                    params: { storyId },
                  })
                }
              />
            ))}

        {tag == "themes" &&
          mode == "parent" &&
          themesData && themesData.stories
            .map((item: any, idx: number) => (
              <StoryCard1
                key={idx}
                num={idx + 1}
                story={item}
                onPlay={(storyId: string) =>
                  router.push({
                    pathname: "/(parent)/(listen)/listenStory",
                    params: { storyId },
                  })
                }
              />
            ))}
      </ScrollView>
    </ThemedView>
  );
};

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
          <Image
            source={require("@/assets/images/kid/arrow-right.png")}
            style={styles.sectionArrow}
          />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  horizontalScrollContent: {
    gap: 20,
    paddingHorizontal: 16,
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
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectiondesc: {
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 24,
  },
  sectionArrow: {
    width: 24,
    height: 24,
    tintColor: '#053B4A'
  },
  arrowIcon: {
    tintColor: "#F4A672",
    marginRight: 16,
    marginBottom: 10,
  },
});

export default StoryItems;
