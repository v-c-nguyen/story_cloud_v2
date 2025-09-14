import { Image } from 'expo-image';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';

import IconKidCong from "@/assets/images/auth/auth-kid-cong.svg";
const { width } = Dimensions.get("window");

export default function KidAuthSuccess() {
  const params = useLocalSearchParams();
  const childName = params.childName ? params.childName : '';
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Link href="/(kid)/(dashboard)" asChild>
        <TouchableOpacity style={styles.container}>
          <ThemedView style={styles.container} >
            {/* Background pattern */}
            <Image
              source={require("@/assets/images/auth/success-background.png")}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            />
            <ThemedView style={styles.subContainer}>
              {/* Background pattern */}
              <Image
                source={require("@/assets/images/auth/back-pattern.png")}
                style={styles.backPattern}
                contentFit='cover'
              />
              <IconKidCong
                width={129}
                height={120}
                style={styles.topImage}
              />
              {/* Title */}
              <ThemedText style={styles.title}>
                Welcome, {childName}🎉
              </ThemedText>

              {/* Description */}
              <ThemedText style={styles.description}>
                Explore new worlds and enjoy!
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
      </Link>
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
    width: 129,
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
