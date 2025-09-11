import MaskedView from "@react-native-masked-view/masked-view";
import { ThemedText } from "../ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TextStyle } from "react-native";
import { useEffect } from "react";

export default function GradientText({text, style}: {text: string, style?: TextStyle}) {
    return (
        <MaskedView
            maskElement={
                <ThemedText style={[styles.lengthLabel, { backgroundColor: 'transparent' }, style]}>
                    {text}
                </ThemedText>
            }
        >
            <LinearGradient
                colors={['#2AEBEB', '#E5DDA3', '#E29E6E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ alignSelf: 'flex-start' }} // width should cover the text
            >
                <ThemedText style={[ styles.lengthLabel, { opacity: 0 }]}>
                    {text}
                </ThemedText>
            </LinearGradient>
        </MaskedView>
    )
}

const styles = StyleSheet.create({
  lengthLabel: {
    color: "#9fd3c7",
    fontSize: 16,
    fontWeight: 700,
    marginRight: 8,
  },
});