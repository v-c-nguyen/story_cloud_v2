import { Image } from 'expo-image';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack } from 'expo-router';
import React from 'react';
import IconParentTop from "@/assets/images/auth/auth-parent-top.svg"
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"


export default function ParentalAuthVerify() {
  const [code, setCode] = React.useState(['', '', '', ''])
  const inputs = React.useRef<Array<TextInput | null>>([]);

  const year = code.join('');
  const canContinue = year.length === 4 && Number(year) < 2000 && Number(year) > 1950;

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
        <IconParentTop
          style={styles.topImage}
        />
        {/* Title */}
        <ThemedText style={styles.title}>Parent</ThemedText>

        {/* Subtitle */}
        <ThemedText style={styles.subtitle}>
          Enter the year you were born. This just verifies your age. It isn't
          stored.
        </ThemedText>

        <ThemedView style={styles.illustrationWrap}>
          {/* Main illustration */}
          <Image
            source={require("@/assets/images/auth/background.png")}
            style={styles.illustration}
            contentFit="cover"
          />

          <ThemedView style={[styles.inputWrap]}>
            {code.map((digit, i) => (
              <TextInput
                key={i}
                style={styles.inputRect}
                maxLength={1}
                placeholder="#"
                keyboardType="number-pad"
                value={digit}
                textAlign="center"
                onChangeText={val => {
                  if (/^\d?$/.test(val)) {
                    const newCode = [...code];
                    newCode[i] = val;
                    setCode(newCode);
                    if (val && i < 3) {
                      inputs.current[i + 1]?.focus();
                    }
                    if (!val && i > 0) {
                      // If cleared, go back
                      inputs.current[i - 1]?.focus();
                    }
                  }
                }}
                ref={el => { inputs.current[i] = el; }}
                returnKeyType={i === 3 ? "done" : "next"}
              />
            ))}
          </ThemedView>
          {/* Buttons */}
          <ThemedView style={styles.buttonRow}>
            <Link href="../" asChild>
              <TouchableOpacity style={styles.backButton}>
                <IconArrowLeft
                  width={24}
                  height={24}
                  color="#FCFCFC"
                />
                <ThemedText style={styles.backText}>Back</ThemedText>
              </TouchableOpacity>
            </Link>
            <Link href={canContinue ? "./info" : "./signin"} asChild>
              <TouchableOpacity
                disabled={!canContinue}
              >
                <ThemedView
                  style={[styles.nextButton, !canContinue && { opacity: 0.5 }]}
                >
                  <ThemedText style={styles.nextText}>Next</ThemedText>
                  <IconArrowRight
                    width={24}
                    height={24}
                    color="#053B4A"
                  />
                </ThemedView>
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
    width: 100,
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
    marginBottom: 30
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
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
    flexDirection: "column",
  },
  illustration: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  inputWrap: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  inputRect: {
    width: 49,
    height: 48,
    paddingVertical: 0, // For Android compatibility
    justifyContent: 'center',
    backgroundColor: "#F8ECAE",
    borderRadius: 8,
    textAlign: "center",
    outlineWidth: 0,
    color: "#053b4a80",
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