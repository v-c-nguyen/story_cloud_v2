import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack } from 'expo-router';
import React from 'react';

import IconParentFullBody from "@/assets/images/auth/auth-parent-fullbody.svg"
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"

export default function ParentalAuthInfo() {
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
        <IconParentFullBody
          width={93}
          height={100}
          style={styles.topImage}
        />

        {/* Title */}
        <ThemedText style={styles.title}>
          With a <ThemedText type='bigType' style={{ color: "#F4A672" }}>parent's</ThemedText> account
        </ThemedText>

        <ThemedView style={styles.illustrationWrap}>
          {/* Main illustration */}
          <Image
            source={require("@/assets/images/auth/background.png")}
            style={styles.illustration}
            contentFit="cover"
          />

          <ThemedText style={styles.mainText}>
            Now you can sign in and create a profile for each kid. If you choose
            to sign in, you get more controls, whether you want to allow lots of
            videos or hand pick your own. The next time you sign in to a device,
            your kids' profiles will be ready to go. Sign in with a parent's
            account and we'll get started!
          </ThemedText>
          {/* Buttons */}
          <ThemedView style={styles.buttonRow}>
            <Link href="./verify" asChild>
              <TouchableOpacity style={styles.backButton}>
                <IconArrowLeft
                  width={24}
                  height={24}
                  color={"#ffffff"}
                />
                <ThemedText style={styles.backText}>Back</ThemedText>
              </TouchableOpacity>
            </Link>
            <Link href="./signin" asChild>
              <TouchableOpacity style={styles.nextButton}>
                <ThemedText style={styles.nextText}>Next</ThemedText>
                <IconArrowRight
                  width={24}
                  height={24}
                  color={"#053B4A"}
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
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    position: "relative",
  },
  backPattern: {
    position: "absolute", width: "100%", height: "100%"
  },
  topImage: {
    top: 0,
    left: 0,
    marginTop: 60,
  },
  title: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  illustrationWrap: {
    width: "100%",
    flex: 1,
    marginBottom: 60,
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
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
    color: "#fcfcfc",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 24.3,
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
