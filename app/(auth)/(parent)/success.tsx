import { Image } from 'expo-image';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import supabase from '@/app/lib/supabase';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

import IconSuccess from "@/assets/images/auth/auth-congratulations.svg"

const { width } = Dimensions.get("window");

export default function ParentalAuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const updateFirstLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        await supabase
          .from("users")
          .update({ first_login: false })
          .eq("id", session.user.id);
      }
    };

    updateFirstLogin();
  }, [])
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Link href="/(parent)/(profiles)/(account)" asChild>
        <TouchableOpacity style={styles.container}>
          <ThemedView style={styles.container}>
            {/* Background pattern */}
            <Image
              source={require("@/assets/images/auth/success-background.png")}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            />
            <ThemedView style={styles.subContainer}>

              <Image
                source={require("@/assets/images/auth/back-pattern.png")}
                style={styles.backPattern}
                contentFit='cover'
              />
              <IconSuccess
                style={styles.topImage}
              />
              {/* Title */}
              <ThemedText style={styles.title}>
                Congratulations🎉
              </ThemedText>

              {/* Description */}
              <ThemedText style={styles.description}>
                Now You can teach your children while they play.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
      </Link >
    </>
  );
}

const BUTTON_HEIGHT = 48;
const BUTTON_RADIUS = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backPattern: {
    position: "absolute", width: "100%", height: "100%"
  },
  subContainer: {
    marginTop: 60,
    marginBottom: 84,
    marginHorizontal: 16,
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "auto",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#053b4a33",
  },
  topImage: {
    width: 120,
    height: 120,
  },
  title: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
    color: "#053B4A",
    fontSize: 30,
    lineHeight: 40.5,
    fontWeight: "700",
  },
  description: {
    color: "#053B4A",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 27,
  },
});
