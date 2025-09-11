import { SeriesCard2, SeriesCard_Parent, StoryCard1 } from "@/components/Cards";
import { ThemedView } from "@/components/ThemedView";
import { useSeriesStore } from "@/store/seriesStore";
import { useStoryStore } from "@/store/storyStore";
import normalize from "@/app/lib/normalize";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface StoryItemsProps {
  seriesCategory: string;
  tag: string;
  mode: string;
  direction?: string;
  filter?: string;
  collectionsCategories?: any;
  seriesCategories?: any;
  themesCategories?: any;
  charactersCategories?: any;
}
const StoryItems: React.FC<StoryItemsProps> = ({
  seriesCategory,
  tag,
  mode,
  direction = "horizontal",
  filter = "all",
  collectionsCategories,
  seriesCategories,
  themesCategories,
  charactersCategories,
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
        contentContainerStyle={styles.horizontalScrollContent}
      >
        {/* Parent Mode Learning --- Stories */}
        {tag == "stories" &&
          seriesCategories && seriesCategories.stories
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

        {/* Parent Mode Learning Library --Series */}
        {tag == "series" &&
          mode == "parent" &&
          filter != "stories" &&
          seriesCategories && seriesCategories.series
            .map((item: any, idx: number) => <SeriesCard_Parent key={idx} series={item} />)}

        {tag == "series" &&
          mode == "parent" &&
          filter != "series" &&
          seriesCategories && seriesCategories.stories
            .map((item: any, idx: number) =>
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
              />)}

        {tag == "series" &&
          mode != "parent" &&
          series
            .filter(
              (story) =>
                normalize(story.series_category) === normalize(seriesCategory)
            )
            .map((item, idx) => (
              <SeriesCard2
                key={idx}
                name={item.name}
                episode_count={item.episode_count ?? 0}
                image={item.image ?? ""}
                isFavorite={item.isFavorite ?? false}
              />
            ))}

        {/* Parent Learning Libaray Collections */}

        {tag == "collections" &&
          mode == "parent" &&
          filter != "stories" &&
          collectionsCategories.series && collectionsCategories.series
            .map((item: any, idx: number) => <SeriesCard_Parent key={idx} series={item} />)}

        {tag == "collections" &&
          mode == "parent" &&
          filter != "series" &&
          collectionsCategories && collectionsCategories.stories
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

        {tag == "characters" &&
          mode == "parent" &&
          filter != "stories" &&
          charactersCategories && charactersCategories.series
            .map((item: any, idx: number) => <SeriesCard_Parent key={idx} series={item} />)}

        {tag == "characters" &&
          mode == "parent" &&
          filter != "series" &&
          charactersCategories && charactersCategories.stories
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
          themesCategories && themesCategories.stories
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
  arrowIcon: {
    tintColor: "#F4A672",
    marginRight: 16,
    marginBottom: 10,
  },
});

export default StoryItems;
