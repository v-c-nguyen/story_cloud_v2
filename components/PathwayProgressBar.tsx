import { LinearGradient } from 'expo-linear-gradient';

import { Image, ScrollView, StyleSheet } from "react-native";
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Child } from '@/store/childrenStore';
import { useEffect, useState } from 'react';

function FootIcon({ color }: { color: string }) {
  return (
    <Image
      source={require('@/assets/images/kid/foot-line.png')}
      style={{ width: 24, height: 24 }}
    ></Image>
  );
}

export default function PathwayProgressBar({ total, current = 1, child }: { total: number, current: number, child: any }) {

  const [steps, setSteps] = useState<number[]>([]);
  useEffect(() => {
    if (total != 0) {
      const stepArray = Array.from({ length: total }, (_, i) => i + 1);
      setSteps(stepArray);
    }
  }, [total])

  return (
    <ThemedView style={progressStyles.container}>

      {total > 0 &&
        <ScrollView>
          <ThemedView style={{ position: 'relative', width: '100%' }}>
            {/* Progress Bar Background */}
            <ThemedView style={progressStyles.nameAvatarWrap}>
              <ThemedView style={progressStyles.nameBadge}>
                <ThemedText style={progressStyles.nameText}>{child?.name}</ThemedText>
                <Image
                  source={child?.avatar_url ? { uri: child.avatar_url } : require('@/assets/images/kid/avatars/jesse.png')}
                  style={progressStyles.avatar}
                />
              </ThemedView>
            </ThemedView>

            {/* Steps */}
            <ThemedView style={progressStyles.stepsRow}>

              <ThemedView style={[progressStyles.barBg, { width: 92 * (total + 1) }]} >
                <ThemedView style={[progressStyles.barFill, { width: 92 * (current - 1) }]} />
              </ThemedView>
              {steps.map((step, idx) => (
                <ThemedView key={idx} style={progressStyles.stepWrap}>
                  {/* Step Circle */}
                  <LinearGradient
                    colors={['#E29E6E', '#E5DDA3', '#2AEBEB']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0.26, y: 0 }}
                    style={[
                      idx + 1 == current ? progressStyles.stepCircleActive : progressStyles.stepCircle,
                    ]}
                  >
                    <ThemedView
                      style={[
                        progressStyles.stepInnerCircle,
                        idx + 1 < current
                          ? { backgroundColor: "#F4A672", borderColor: "#FCFCFC" }
                          : idx + 1 == current ?
                            { borderColor: "#FCFCFC" }
                            : { backgroundColor: "#FCFCFC", borderColor: '#00000000', width: 38, height: 38, margin: 2 },
                      ]}
                    >
                      <FootIcon color="#053B4A" />
                    </ThemedView>
                  </LinearGradient>
                  {/* Step Number */}
                  <ThemedText style={progressStyles.stepNum}>{step}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ScrollView>
      }
    </ThemedView >
  );
}

const progressStyles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  nameAvatarWrap: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 16,
  },
  nameBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4A672",
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 2,
    paddingLeft: 8,
    gap: 5,
  },
  nameText: {
    color: "#053B4A",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 999,
    marginLeft: 4,
  },
  barBg: {
    position: "absolute",
    top: '25%',
    left: 16,
    right: 0,
    height: 10,
    backgroundColor: "rgba(173,215,218,0.2)",
    borderRadius: 5,
    zIndex: 0,
  },
  barFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 10,
    backgroundColor: "#F4A672",
    zIndex: 1,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: 'relative',
    marginTop: 13,
    marginLeft: 5,
    marginRight: 25,
    zIndex: 2,
  },
  stepWrap: {
    alignItems: "center",
    width: 50,
    marginRight: 40
  },
  stepCircle: {
    width: 42,
    height: 42,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    boxSizing: 'border-box',
  },
  stepInnerCircle: {
    width: 42,
    height: 42,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    boxSizing: 'border-box',
  },
  stepCircleActive: {
    boxSizing: 'border-box',
    width: 42,
    height: 42,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    shadowColor: "#DD986A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  stepNum: {
    color: "#053B4A",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.14,
    textAlign: "center",
  },
});