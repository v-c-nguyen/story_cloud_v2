import { Image } from "expo-image";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useUser } from "@/app/lib/UserContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Stack, useRouter } from "expo-router";
import React from "react";

import IconFamily from "@/assets/images/auth/auth-family.svg";
import IconParent from "@/assets/images/auth/auth-parent-avatar.svg";
import IconKid from "@/assets/images/auth/auth-kid-avatar.svg";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const { user, setUser } = useUser();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedView style={styles.root}>
        {/* Background pattern (optional, can use SVG or ImageBackground) */}
        <IconFamily
          style={styles.familyBg}
          pointerEvents="none"
        />

        {/* Title */}
        <ThemedView style={styles.titleWrap}>
          <ThemedText style={styles.title}>
            Which{" "}
            <ThemedText type="bigType" style={styles.titleOrange}>
              StoryCloud
            </ThemedText>{" "}
            mode do you choose?
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.illustrationWrap}>
          {/* Main illustration */}
          <Image
            source={require("@/assets/images/auth/background.png")}
            style={styles.illustration}
            pointerEvents="none"
          />

          {/* Mode Buttons */}
          <ThemedView style={styles.buttonsWrap}>
            {/* Kid */}
            <Link href="/(auth)/(kid)" asChild>
              <TouchableOpacity style={styles.kidBtn}>
                <ThemedView style={styles.avatarCircle}>
                  <IconKid
                    style={styles.avatar}
                  />
                </ThemedView>
                <ThemedText style={styles.btnText}>I’m a Kid</ThemedText>
              </TouchableOpacity>
            </Link>
            {/* Parent */}
            <Link href="/(auth)/(parent)" asChild>
              <TouchableOpacity style={styles.parentBtn}>
                <ThemedView style={styles.avatarCircleParent}>
                  <IconParent
                    style={styles.avatar}
                  />
                </ThemedView>
                <ThemedText style={styles.btnText}>I’m a Parent</ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>
        </ThemedView>
        {/* Learn more */}
        <TouchableOpacity style={styles.learnMoreWrap}>
          <ThemedText style={styles.learnMoreText}>Learn more</ThemedText>
          <Image
            source={require("@/assets/images/icons/arrow-right.png")}
            style={styles.learnMoreIcon}
          ></Image>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: "100%",
    paddingBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#F8ECAE",
  },
  backPattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  safe: {
    flexDirection: "column",
    justifyContent: "center",
    width: width,
    height: "100%",
    backgroundColor: "#F8ECAE",
  },
  root: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  familyBg: {
    top: 0,
    left: 0,
    width: 185,
    height: 100,
    marginTop: 60,
  },
  titleWrap: {
    marginTop: 10,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
    color: "#053B4A",
  },
  titleOrange: {
    color: "#F4A672",
  },
  illustrationWrap: {
    width: "100%",
    flex: 1,
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  illustration: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    zIndex: 1,
  },
  buttonsWrap: {
    width: 301,
    alignSelf: "center",
    gap: 10,
    zIndex: 2,
  },
  kidBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8ECAE",
    borderRadius: 70,
    paddingVertical: 4,
    paddingLeft: 20,
    paddingRight: 40,
    gap: 20,
    shadowColor: "#053B4A",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  parentBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4A672",
    borderRadius: 70,
    paddingVertical: 4,
    paddingLeft: 20,
    paddingRight: 40,
    gap: 20,
    shadowColor: "#053B4A",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircleParent: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 72,
    height: 72,
  },
  btnText: {
    color: "#053B4A",
    fontSize: 24,
    fontWeight: "400",
    lineHeight: 24,
  },
  learnMoreWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  learnMoreText: {
    color: "#048F99",
    fontSize: 20,
    fontWeight: "700",
  },
  learnMoreIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
