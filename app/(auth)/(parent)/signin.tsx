import { Image } from "expo-image";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import supabase from "@/app/lib/supabase";
import { useUser } from "@/app/lib/UserContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Stack, useRouter } from "expo-router";
import React from "react";
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"
import IconEye from "@/assets/images/auth/icon-eye-close.svg"

export default function ParentAuthSignIn() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [secure, setSecure] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const { user, setUser } = useUser();

  React.useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
        router.replace("/(parent)/(dashboard)");
      }
    }
    checkAuth();
  }, [user]);

  async function signInWithEmail() {
    setLoading(true); // Start loading
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setLoading(false); // Stop loading on error
      Alert.alert(error.message);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session?.user.id)
      .maybeSingle();

    if (userError) {
      alert(userError.message);
      Alert.alert("error", userError.message);
      return;
    }

    // Store user in context
    if (session?.user) {
      setLoading(false); // Stop loading on error
      setUser({
        id: session.user.id,
        email: session.user.email ?? "",
        name: userData?.name ?? "",
        avatar_url: userData?.avatar_url ?? "",
        phonenumber: userData?.phonenumber ?? "",
        // Add other fields if needed
      });
    }
    const firstLogin = userData?.first_login;
    setLoading(false); // Stop loading before navigation
    if (firstLogin) {
      router.replace("./notice");
    } else {
      router.replace("/(parent)/(dashboard)");
    }
  }

  async function ForgotPassword() {
    router.push("./forgotPassword");
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedView style={styles.titleRow}>
              <ThemedText style={styles.signText}>Sign </ThemedText>
              <ThemedText style={styles.inText}>In</ThemedText>
            </ThemedView>

            {/* Card Container */}
            <ThemedView style={styles.card}>
              {/* Subtitle */}
              <ThemedText style={styles.subtitle}>
                Please enter your details
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

              {/* Forgot Password */}
              <TouchableOpacity onPress={ForgotPassword} hitSlop={10}>
                <ThemedText style={styles.forgot}>Forgot password?</ThemedText>
              </TouchableOpacity>

              {/* Log In Button */}
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={signInWithEmail}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#053B4A" />
                ) : (
                  <>
                    <ThemedText style={styles.loginText}>Log In</ThemedText>
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
    paddingVertical: 10,
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
