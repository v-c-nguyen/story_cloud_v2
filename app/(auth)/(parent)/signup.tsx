import { Image } from "expo-image";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useUser } from "@/app/lib/UserContext";
import supabase from "@/app/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"
import IconEye from "@/assets/images/icons/icon-eye-close.svg"

export default function ParentAuthSignUp() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [secure, setSecure] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const { user, setUser } = useUser();

  async function signUpWithEmail() {
    setLoading(true); // Start loading
    // First, sign up the user with email and password
    const {
      data: { user, session },
      error: signUpError,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpError) {
      setLoading(false); // Stop loading on error
      Alert.alert("Sign up error", signUpError.message);
      return;
    }
    // If signup successful and we have a user, save the name to custom users table
    const { data: userData, error: profileError } = await supabase
      .from("users")
      .insert([
        {
          id: user?.id,
          name: name,
          role: "parent",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (profileError) {
      setLoading(false); // Stop loading on error
      Alert.alert("Profile creation error", profileError.message);
      return;
    }

    if (!session) {
      setLoading(false); // Stop loading on error
      Alert.alert("Please check your inbox for email verification!");
    }

    // Store user in context
    if (session?.user) {
      setLoading(false); // Stop loading on error
      setUser({
        id: session.user.id,
        email: session.user.email ?? "",
        name: userData?.[0]?.name ?? "",
        avatar_url: userData?.[0]?.avatar_url ?? "",
        phonenumber: userData?.[0]?.phonenumber ?? "",
        // Add other fields if needed
      });
    }
    setLoading(false); // Stop loading on error
    Alert.alert("Registered Successfully!");
    router.replace("./notice");
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
            <ThemedView style={styles.titleRow}>
              <ThemedText style={styles.signText}>Sign </ThemedText>
              <ThemedText style={styles.inText}>Up</ThemedText>
            </ThemedView>

            {/* Card Container */}
            <ThemedView style={styles.card}>
              {/* Subtitle */}
              <ThemedText style={styles.subtitle}>
                Please enter your details
              </ThemedText>

              {/* Name Input */}
              <ThemedView style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="rgba(5,59,74,0.20)"
                  value={name}
                  onChangeText={setName}
                  keyboardType="numbers-and-punctuation"
                  autoCapitalize="none"
                />
              </ThemedView>

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

              {/* Password Input */}
              <ThemedView style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(5,59,74,0.20)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secure}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setSecure(!secure)}
                  hitSlop={10}
                >
                  <IconEye
                    width={20}
                    height={20}
                  />
                </TouchableOpacity>
              </ThemedView>

              {/* Log In Button */}
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={signUpWithEmail}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#053B4A" />
                ) : (
                  <>
                    <ThemedText style={styles.loginText}>Sign Up</ThemedText>
                    <IconArrowRight
                      width={24}
                      height={24}
                      color={"#053B4A"}
                    />
                  </>
                )}
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
              <Link href="./signin" asChild>
                {/* Sign Up Button */}
                <TouchableOpacity style={styles.signupBtn}>
                  <ThemedText style={styles.signupText}>Log In</ThemedText>
                </TouchableOpacity>
              </Link>
            </ThemedView>
            {/* Placeholder Image */}
            <Image
              source={require("@/assets/images/auth/background.png")}
              style={styles.bottomImage}
              contentFit="cover"
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
  backPattern: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  subContainer: {
    marginVertical: 60,
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#053b4a33",
  },
  titleRow: {
    flexDirection: "row",
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
