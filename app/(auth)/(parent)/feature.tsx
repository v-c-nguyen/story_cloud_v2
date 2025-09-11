import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack } from 'expo-router';
import React from 'react';

import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconCheck from "@/assets/images/parent/icon-check.svg"

export default function ParentalAuthFeature() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Background pattern */}

        <Image
          source={require("@/assets/images/auth/back-pattern.png")}
          style={styles.backPattern}
          contentFit='cover'
        />
        <ThemedView style={styles.subContainer}>
          {/* Title */}
          <ThemedText style={styles.title}>
            <ThemedText style={styles.titleParent}>Parent{"\n"}</ThemedText>
            <ThemedText style={styles.titleFeature}>Feature Tour</ThemedText>
          </ThemedText>

          {/* Description */}
          <ThemedText style={styles.description}>
            Some Steps of this Mode, Controls, Features. Some Steps of this Mode,
            Controls, Features. Some Steps of this Mode.
          </ThemedText>

          {/* Illustration */}
          <ThemedView style={styles.illustrationWrap}>
            <Image
              source={require("@/assets/images/auth/parent-feature-1.png")}
              style={styles.illustration}
              contentFit="contain"
            />
            {/* Pagination Dots */}
            <ThemedView style={styles.dotsRow}>
              <ThemedView style={[styles.dot, styles.dotActive]} />
              <ThemedView style={styles.dot} />
              <ThemedView style={styles.dot} />
              <ThemedView style={styles.dot} />
            </ThemedView>
          </ThemedView>

          {/* Buttons */}
          <ThemedView style={styles.buttonRow}>
            <Link href="./notice" asChild>
              <TouchableOpacity style={styles.backButton}>
                <IconArrowLeft
                  color={"#053B4A"}
                  style={[styles.buttonIcon]}
                />
                <ThemedText style={styles.backText}>Back</ThemedText>
              </TouchableOpacity>
            </Link>
            <Link href="./success" asChild>
              <TouchableOpacity style={styles.doneButton}>
                <ThemedText style={styles.doneText}>Done</ThemedText>
                <IconCheck
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            </Link>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </>
  );
}

const BUTTON_HEIGHT = 48;
const BUTTON_RADIUS = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    paddingHorizontal: 16,
  },
  subContainer: {
    marginVertical: 60,
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#053b4a33",
  },
  title: {
    textAlign: "center",
    marginTop: 60,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  titleParent: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2
  },
  titleFeature: {
    color: "#F4A672",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2
  },
  backPattern: {
    position: "absolute", width: "100%", height: "100%"
  },
  description: {
    color: "#053B4A",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24.3,
    marginHorizontal: 20,
  },
  illustrationWrap: {
    paddingHorizontal: 20,
    width: "100%",
    flex: 1,
    position: "relative",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: "70%",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#053B4A",
  },
  dotActive: {
    backgroundColor: "#053B4A",
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: "#053B4A",
    backgroundColor: "transparent",
    paddingHorizontal: 29,
    paddingVertical: 10,
    justifyContent: "center",
    gap: 10,
  },
  doneButton: {
    flexDirection: "row",
    alignItems: "center",
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: "#F4A672",
    paddingHorizontal: 29,
    paddingVertical: 10,
    justifyContent: "center",
    gap: 10,
  },
  backText: {
    color: "#053B4A",
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },
  doneText: {
    color: "#053B4A",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
});
