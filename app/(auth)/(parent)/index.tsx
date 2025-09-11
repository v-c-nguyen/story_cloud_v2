import { Image } from 'expo-image';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack, useRouter } from 'expo-router';
import { useUser } from '@/app/lib/UserContext';
import React from 'react';
import supabase from '@/app/lib/supabase';

import IconWelcomeStars from "@/assets/images/auth/auth-welcome-star.svg"
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"

const { width, height } = Dimensions.get("window");

export default function ParentAuthScreen() {
  const { user, setUser } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const expiresAt = session?.expires_at; // Unix timestamp (seconds)
      const now = Math.floor(Date.now() / 1000);

      if (
        user &&
        user.id &&
        token &&
        expiresAt &&
        expiresAt > now // Token is not expired
      ) {
        router.replace('/(parent)/(dashboard)');
      }
    }
    checkAuth();
  }, [user]);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Decorative background shapes would go here if needed */}

        <Image
          source={require("@/assets/images/auth/back-pattern.png")}
          style={styles.backPattern}
          contentFit='cover'
        />
        {/* Top Icon */}
        <IconWelcomeStars
          style={styles.topImage}
        />

        {/* Title */}
        <ThemedText style={styles.title}>Hi, there!</ThemedText>

        {/* Subtitle */}
        <ThemedText style={styles.subtitle}>
          Before letting your child explore the fun world of StoryCloud, take a
          few minutes to decide on important parental safety controls.
        </ThemedText>

        <ThemedView style={styles.illustrationWrap}>
          {/* Main illustration */}
          <Image
            source={require("@/assets/images/auth/background.png")}
            style={styles.illustration}
            resizeMode="cover"
          />
          {/* Buttons */}
          <ThemedView style={styles.buttonRow}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace('/(auth)')}
            >
              <IconArrowLeft
                width={24}
                height={24}
                color="#FCFCFC"
              />
              <ThemedText style={styles.backText}>Back</ThemedText>
            </TouchableOpacity>

            <Link href="./verify" asChild>
              <TouchableOpacity style={styles.nextButton}>
                <ThemedText style={styles.nextText}>Next</ThemedText>
                <IconArrowRight
                  width={24}
                  height={24}
                  color="#053B4A"
                />
              </TouchableOpacity>
            </Link>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </>
  );
}

const BUTTON_HEIGHT = 44;
const BUTTON_RADIUS = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    position: "relative",
  },
  topImage: {
    top: 0,
    left: 0,
    width: 95,
    height: 100,
    marginTop: 60,
  },
  backPattern: {
    position: "absolute", width: "100%", height: "100%"
  },
  title: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
    textAlign: "center",
    marginHorizontal: 10,
  },
  subtitle: {
    color: "#053B4A",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 24.3,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 16,
    marginHorizontal: 30,
  },
  illustrationWrap: {
    width: "100%",
    flex: 1,
    marginBottom: 60,
    height: '100%',
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  illustration: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: "#FCFCFC",
    backgroundColor: "transparent",
    paddingHorizontal: 38,
    paddingVertical: 10,
    justifyContent: "center",
    gap: 10,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: "#F4A672",
    paddingHorizontal: 38,
    paddingVertical: 10,
    justifyContent: "center",
    gap: 10,
  },
  backText: {
    color: "#FCFCFC",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16,
  },
  nextText: {
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16,
  },
});
