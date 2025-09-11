import { Image } from 'expo-image';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import supabase from '@/app/lib/supabase';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function NewPassword() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secure, setSecure] = React.useState(true);


  async function signInWithEmail() {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
      return;
    }


    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('first_login')
      .eq('id', session?.user.id)
      .maybeSingle();

    if (userError) {
      Alert.alert('error', userError.message);
      return;
    }
    const firstLogin = userData?.first_login
    if (firstLogin) {
      router.replace('./notice')
    } else {
      router.replace('./dashboard')
    }

  }

  async function ForgotPassword() {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
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

        <ThemedView style={styles.subContainer}>
          {/* Title */}
          <ScrollView>
            <ThemedView style={styles.titleRow}>
              <ThemedText style={styles.signText}>New </ThemedText>
              <ThemedText style={styles.inText}>Password</ThemedText>
            </ThemedView>

            {/* Card Container */}
            <ThemedView style={styles.card}>
              {/* Subtitle */}
              <ThemedText style={styles.subtitle}>
                Please enter your new password.
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
                  <Image
                    source={require("@/assets/images/auth/icon-eye-close.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </ThemedView>

              {/* Log In Button */}
              <TouchableOpacity style={styles.loginBtn} onPress={signInWithEmail}>
                <ThemedText style={styles.loginText}>Continue</ThemedText>
                {/* Arrow Icon */}
                <Image
                  source={require("@/assets/images/icons/arrow-right.png")}
                  style={{ width: 24, height: 24, tintColor: "#053B4A" }}
                />
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>

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
    position: "absolute", width: "110%", height: "70%", tintColor: "#053b4a1a"
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
    marginBottom: 30
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
