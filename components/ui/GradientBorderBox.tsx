import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type GradientBorderBoxProps = {
  children: React.ReactNode;
  borderRadius?: number;
  borderWidth?: number;
  style?: ViewStyle;
  colors?: readonly [string, string, ...string[]];
  innerStyle?: ViewStyle;
  backgroundColor?: string;
};

export default function GradientBorderBox({
  children,
  borderRadius = 10,
  borderWidth = 2,
  style,
  colors = ['#2AEBEB', '#E5DDA3', '#E29E6E'] as const,
  innerStyle,
  backgroundColor = '#053B4A',
}: GradientBorderBoxProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        {
          borderRadius,
          padding: borderWidth,
        },
        style,
      ]}
    >
      <View
        style={[
          {
            borderRadius: borderRadius - borderWidth,
            backgroundColor,
            paddingVertical: 10,
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
          },
          innerStyle,
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
}