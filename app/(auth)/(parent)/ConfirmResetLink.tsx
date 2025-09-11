import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack } from 'expo-router';
import React from 'react';

import IconParentFullBody from "@/assets/images/auth/auth-parent-fullbody.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"

export default function ConfirmResetLink() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Decorative background shapes would go here if needed */}

        <Image
          source={require("@/assets/images/auth/back-pattern.png")}
          style={styles.backPattern}
          contentFit='fill'
        />
        <Image
          source={require("@/assets/images/auth/back-pattern.png")}
          style={[styles.backPattern, { top: '70%' }]}
          contentFit='fill'
        />
        <IconParentFullBody
          style={styles.topImage}
        />

        {/* Title */}
        <ThemedText style={styles.title}>
          Reset link <ThemedText type='bigType' style={{ color: "#F4A672" }}>has been sent!</ThemedText>
        </ThemedText>

        {/* Main illustration */}
        <ThemedText style={styles.mainText}>
          Please check your inbox and proceed with the link we have sent.
        </ThemedText>
        {/* Buttons */}
        <ThemedView style={styles.buttonRow}>
          <Link href="./signin" asChild>
            <TouchableOpacity style={styles.nextButton}>
              <ThemedText style={styles.nextText}>Back to Log in</ThemedText>
              <IconArrowRight
                width={24}
                height={24}
                color={"#053B4A"}
              />
            </TouchableOpacity>
          </Link>
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
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 30,
    position: "relative",
  },
  topImage: {
    top: 0,
    left: 0,
    width: 93.2,
    height: 100,
    marginBottom:20
  },
  title: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
    textAlign: "center",
    marginTop: 10,
  },
  illustrationWrap: {
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  illustration: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  mainText: {
    marginHorizontal: 20,
    textAlign: "center",
    color: "rgba(5, 59, 74, 1)",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 24.3,
  },
  backPattern: {
    position: "absolute", width: "110%", height: "70%", tintColor: "#053b4a1a"
  },
  buttonRow: {
    width: '100%',
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
