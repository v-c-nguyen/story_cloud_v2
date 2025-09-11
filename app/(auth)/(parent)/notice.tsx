import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack } from 'expo-router';
import React from 'react';
import IconParentFullBody from "@/assets/images/auth/auth-parent-fullbody.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"
import IconCancel from "@/assets/images/parent/icon-cancel.svg"

export default function ParentalAuthNotice() {
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
          style={styles.topImage}
        />


        {/* Title */}
        <ThemedText style={styles.title}>
          <ThemedText type='bigType' style={{ color: "#F4A672", lineHeight: 0 }}>Notice</ThemedText> to {'\n'}parents
        </ThemedText>

        <ThemedView style={styles.illustrationWrap}>
          {/* Main illustration */}
          <Image
            source={require("@/assets/images/auth/background.png")}
            style={styles.illustration}
            contentFit="cover"
          />
          <View style={{ height: '80%' }}>

            <ScrollView style={{ flex: 1, margin: 20, marginBottom: 0 }}>
              <ThemedText style={styles.mainText}>
                <Text style={{ fontWeight: "bold", fontStyle: "italic", color: "white" }}>
                  Important privacy information about StoryClouds Kids.
                </Text>
                {"\n"}
                Before yourchild gets started, we want to make sure you understand how the app
                collects and uses personal information and the privacy controls
                available to you. You are choosing to use StoryCloud Kids as a
                signed-out service. This means that you don’t need to use your
                Google account for the app to work. Google account for the app.
                Because StoryCloud Kids runs in a signed-out mode, the app does not
                ask for, store, or share your child’s name, email address, or
                precise location. Instead, the app creates a short-lived, random
                session ID so it can remember which stories have been opened, which
                pages have been read, and what narration or drawings have been saved
                on the device. No advertising identifiers, phone numbers, or contact
                lists are ever accessed. Any audio recordings your child makes while
                reading interactive stories stay on the device unless you or your
                child choose to tap the Save & Sync button. When that button is
                pressed, the recording is encrypted, uploaded securely, and stored
                on StoryCloud servers only so that it can be replayed the next time
                your child opens the story. You can review or delete every saved
                item at any time from the Grown-ups Menu → Library → My Child’s
                Creations screen. Minimal, anonymous analytics such as how long a
                book page stays on screen or whether a video illustration fails to
                load help us fix bugs and decide which features kids like best.
                These analytics never include personal details and can be paused
                entirely by toggling Analytics Off in the Grown-ups Menu. Turning
                analytics off will not limit your child’s access to stories; it
                simply prevents the app from sending usage statistics. If you later
                decide you want cross-device syncing or personalized
                recommendations, you can sign in with your own Google account from
                the Grown-ups Menu. Doing so is optional and can be reversed at any
                time, returning the app to signed-out mode. For questions,
                data-deletion requests, or further information, please email
                privacy@storycloud.com. We respond to all parent inquiries within
                30 days and are committed to keeping StoryCloud Kids a safe,
                imagination-filled space for every child.
              </ThemedText>
            </ScrollView>
          </View>
          {/* Buttons */}
          <ThemedView style={styles.buttonRow}>
            <Link href="./signin" asChild>
              <TouchableOpacity style={styles.backButton}>
                <IconCancel
                  width={24}
                  height={24}
                />
                <ThemedText style={styles.backText}>Decline</ThemedText>
              </TouchableOpacity>
            </Link>
            <Link href="./feature" asChild>
              <TouchableOpacity style={styles.nextButton}>
                <ThemedText style={styles.nextText}>I Agree</ThemedText>
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
    width: 93.2,
    height: 100,
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
    marginRight: 20,
    color: "#fcfcfc",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 26.3,
    marginTop: 20
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: "#FCFCFC",
    backgroundColor: "transparent",
    paddingHorizontal: 29,
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
    paddingHorizontal: 29,
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

