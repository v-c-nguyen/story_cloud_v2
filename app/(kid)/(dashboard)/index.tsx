import supabase from "@/app/lib/supabase";
import { useUser } from "@/app/lib/UserContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useChildrenStore } from "@/store/childrenStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { RelativePathString, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";

// Data arrays for each section
import IconAvatarRight from "@/assets/images/icons/arrow-right.svg"
export default function FocusModeHome() {

  const router = useRouter();
  const { child } = useUser();
  const setActiveChild = useChildrenStore((state) => state.setActiveChild);
  const [mode, setMode] = React.useState(child?.mode);
  const setFavoriteStories = useFavoritesStore((s) => s.setStories);
  const setFavoriteSeries = useFavoritesStore((s) => s.setSeries);

  useEffect(() => {
    switch (mode) {
      case "free":
        router.push("./free");
        break;
      case "focus":
        router.push("./focus");
        break;
      case "pathway":
        router.push("./pathway");
        break;
    }
  }, [mode]);

  useEffect(() => {
    if (child) {
      setActiveChild(child);
    }
  }, [child]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke(`favorites/${child?.id}`, {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching favorites:', error.message);
        } else if (data) {
          // Save to favorites store
          console.log(data)
          setFavoriteStories(data.stories || []);
          setFavoriteSeries(data.series || []);
        }
      } catch (e) {
        console.error('Error fetching favorites:', e);
      } finally {
      }
    }
    if (child?.id) fetchFavorites();
  }, [child]);

  return (
    <>
      <Stack.Screen options={{
        headerShown: false
      }} />
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
        <IconAvatarRight
          width={24}
          height={24}
          color={"#053B4A"}
        />
      </TouchableOpacity>
    </ThemedView>

  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#ADD7DA",
    position: "relative",
  },
  topBackPattern: {
    width: "100%",
    height: "100%",
    maxHeight: 1200,
    position: "absolute",
  },
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
    width: "100%",
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
});
