import { Image } from "expo-image";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

import supabase from "@/app/lib/supabase";
import { useUser } from "@/app/lib/UserContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import IconKidVector from "@/assets/images/auth/kong-vector.svg";
import IconDefaultAvatar from "@/assets/images/icons/icon-parent-3.svg"
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg";

const { width, height } = Dimensions.get("window");

export default function WhoAreYouScreen() {
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { setChild } = useUser();

  async function handleChildSelect(id: string) {
    const jwt =
      supabase.auth.getSession &&
      (await supabase.auth.getSession())?.data?.session?.access_token;
    if (!jwt) return;

    try {
      const response = await fetch(
        `https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/children/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: jwt ? `Bearer ${jwt}` : "",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        Alert.alert(result.message || "Failed to fetch child details");
        return;
      }

      setChild({
        id: result.data[0].id ?? "",
        name: result.data[0].name,
        avatar_url: result.data[0].avatar_url || "",
        mode: result.data[0].mode || "free",
        age: result.data[0].age || 0,
      });
      router.push(`./success?childName=${result.data[0].name}`);
    } catch (error) { }
  }

  useEffect(() => {
    async function fetchChildren() {
      setLoading(true);
      try {
        // You may need to adjust the endpoint or query params as per your API
        const jwt =
          supabase.auth.getSession &&
          (await supabase.auth.getSession())?.data?.session?.access_token;
        // Fetch childrens
        const { data, error } = await supabase.functions.invoke("children", {
          method: "GET",
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : "",
          },
        });
        if (error) {
          console.error("Error fetching children:", error.message);
        } else if (data && Array.isArray(data.data)) {
          setChildren(data.data);
        }
      } catch (e) {
        console.error("Error fetching children:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchChildren();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
                  <Image
                    source={require("@/assets/images/auth/back-pattern.png")}
                    style={styles.backPattern}
                    contentFit='cover'
                    pointerEvents="none"
                  />
        <ThemedView style={styles.subContainer}>
          {/* Title */}
          <ThemedView style={styles.titleContainer}>
            <ThemedText style={styles.title1}>Who are </ThemedText>
            <ThemedText style={styles.title2}>You?</ThemedText>
          </ThemedView>

          {/* Children Cards */}
          <ThemedView
            style={{ position: "absolute", top: 180, width: "100%", zIndex: 5 }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#053B4A" style={{ marginTop: 30 }} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.childrenRow}
              >
                {children.map((child, idx) => (
                  <TouchableHighlight
                    key={child.id || idx}
                    onPress={(e) => handleChildSelect(child.id)}
                    style={{ marginHorizontal: "auto" }}
                  >
                    <ThemedView style={styles.childCard}>
                      {

                        child.avatar_url
                          ? <Image
                            source={{ uri: child.avatar_url }}
                            style={styles.childImage}
                          />
                          :
                          <IconDefaultAvatar width={120} height={120} />
                      }
                      <ThemedText style={styles.childName}>
                        {child.name}
                      </ThemedText>
                      <IconKidVector
                        width={106}
                        height={62}
                        style={styles.childAccent}
                      />
                    </ThemedView>
                  </TouchableHighlight>
                ))}
              </ScrollView>
            )}
            {/* Dots */}
            <ThemedView style={styles.dotsContainer}>
              {children && children.length > 1 &&
                children.map((_, idx) => (
                  <ThemedView
                    key={idx}
                    style={idx === 0 ? styles.dotActive : styles.dotInactive}
                  />
                ))}
            </ThemedView>
          </ThemedView>

          {/* Main Image */}
          <Image
            source={require("@/assets/images/auth/background.png")}
            style={styles.mainImage}
          />

          {/* Bottom Card */}
          <ThemedView style={styles.bottomCard}>
            <ThemedText style={styles.bottomText}>
              All Your Children from this Account
            </ThemedText>
            <Link href="../" asChild>
              <TouchableOpacity style={styles.backButton}>
                <IconArrowLeft
                  width={24}
                  height={24}
                  color={"#FCFCFC"}
                />
                <ThemedText style={styles.backText}>Back</ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    paddingHorizontal: 16,
  },
  backPattern: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  subContainer: {
    marginVertical: 60,
    flex: 1,
    height: "100%",
    width: "100%",

    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#053b4a33",
    position: "relative",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 30,
    marginTop: 120,
  },
  title1: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    // fontFamily: 'Sitara', // If available
    lineHeight: 46.2,
  },
  title2: {
    color: "#F4A672",
    fontSize: 42,
    fontWeight: "700",
    // fontFamily: 'Sitara',
    lineHeight: 46.2,
  },
  childrenRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    minWidth: "100%",
    paddingHorizontal: 50,
  },
  childCard: {
    backgroundColor: "#F8ECAE",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(4,58,73,0.20)",
    paddingHorizontal: 60,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },
  childImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#E29E6E",
  },
  childName: {
    color: "#053B4A",
    fontSize: 24,
    fontWeight: "700",
    // fontFamily: 'Sitara',
    lineHeight: 24,
    textAlign: "center",
  },
  childAccent: {
    width: 106,
    height: 62,
  },
  dotsContainer: {
    alignSelf: "center",
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F8ECAE",
    borderWidth: 2,
    borderColor: "#F8ECAE",
  },
  dotInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#F8ECAE",
    backgroundColor: "transparent",
  },
  mainImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "65%",
    borderRadius: 20,
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    height: 120,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  bottomText: {
    color: "#FCFCFC",
    fontSize: 16,
    // fontFamily: 'Sitara',
    fontWeight: "400",
    textAlign: "center",
  },
  backButton: {
    width: 240,
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "#FCFCFC",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  backText: {
    color: "#FCFCFC",
    fontSize: 16,
    // fontFamily: 'Sitara',
    fontWeight: "400",
    lineHeight: 16,
  },
});
