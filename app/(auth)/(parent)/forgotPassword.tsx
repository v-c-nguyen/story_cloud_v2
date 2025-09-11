import { Image } from "expo-image";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import supabase from "@/app/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Stack, useRouter } from "expo-router";
import React from "react";
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [secure, setSecure] = React.useState(true);

  async function handleSubmit() {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "./NewPassword",
    });
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    router.push("./ConfirmResetLink");
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <Image
          source={require("@/assets/images/auth/back-pattern.png")}
          style={styles.backPattern}
          contentFit="cover"
        />

        <ThemedView style={styles.subContainer}>
          {/* Title */}
          <ScrollView>
            <ThemedView style={[styles.titleRow, { paddingHorizontal: 20 }]}>
              <ThemedText style={[styles.signText]}>Forgot </ThemedText>
              <ThemedText style={styles.inText}>Password?</ThemedText>
            </ThemedView>

            {/* Card Container */}
            <ThemedView style={styles.card}>
              {/* Subtitle */}
              <ThemedText style={styles.subtitle}>
                Provide your email to get a link to reset your password.
              </ThemedText>

              {/* Email Input */}
              <ThemedView style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(5,59,74,0.20)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </ThemedView>

              {/* Button */}
              <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
                <ThemedText style={styles.loginText}>Reset Password</ThemedText>
                {/* Arrow Icon */}
                <IconArrowRight
                  width={24}
                  height={24}
                  color={"#053B4A"}
                />
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>

          {/* Bottom Card */}
          <ThemedView style={styles.bottomCard}>
            <ThemedText style={styles.bottomText}>
              Don’t Have an Account?
            </ThemedText>
            <ThemedView style={styles.bottomRow}>
              {/* Back Button */}
              <Link href="../" asChild>
                <TouchableOpacity style={styles.backBtn}>
                  {/* Back Icon */}
                  <IconArrowLeft
                    width={24}
                    height={24}
                    color={"#ffffff"}
                  />
                  <ThemedText style={styles.backText}>Back</ThemedText>
                </TouchableOpacity>
              </Link>
              <Link href="./signup" asChild>
                {/* Sign Up Button */}
                <TouchableOpacity style={styles.signupBtn}>
                  <ThemedText style={styles.signupText}>Sign Up</ThemedText>
                </TouchableOpacity>
              </Link>
            </ThemedView>
            {/* Placeholder Image */}
            <Image
              source={require("@/assets/images/auth/background.png")}
              style={styles.bottomImage}
              resizeMode="cover"
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </>
  );
}

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
  backPattern: {
    position: "absolute",
    left: 0,
    backgroundRepeat: "repeat",
    width: "100%",
    height: "100%",
    tintColor: "#053b4a1a",
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 30,
    marginTop: 120,
  },
  signText: {
    color: "#053B4A",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
  },
  inText: {
    color: "#F4A672",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 46.2,
  },
  card: {
    flex: 1,
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  subtitle: {
    color: "#053B4A",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "center",
  },
  inputBox: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#F8ECAE",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(5,59,74,0.20)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgot: {
    color: "#048F99",
    fontSize: 16,
    fontWeight: "700",
    alignSelf: "flex-end",
  },
  loginBtn: {
    width: 303,
    alignSelf: "center",
    backgroundColor: "#F4A672",
    borderRadius: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  loginText: {
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16,
  },
  bottomCard: {
    width: "100%",
    height: 120,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  bottomText: {
    color: "#FCFCFC",
    fontSize: 16,
    fontWeight: "400",
    zIndex: 2,
  },
  bottomRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    zIndex: 2,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 38,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "#FCFCFC",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  backText: {
    color: "#FCFCFC",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16,
  },
  signupBtn: {
    backgroundColor: "#ADD7DA",
    borderRadius: 70,
    paddingVertical: 14,
    paddingHorizontal: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    color: "#053B4A",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16,
  },
  bottomImage: {
    width: "100%",
    height: 120,
    borderRadius: 20,
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
});
