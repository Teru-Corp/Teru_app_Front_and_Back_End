// app/(tabs)/onboarding/intro.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FooterNav from "../composants/FooterNav";
import TeruBot from "../../../assets/icons/teru_intro_orange.svg";

const GREEN = "#E19A93"; // same green as FooterNav button

export default function OnBoardingIntro() {
  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressSegment, { backgroundColor: GREEN }]} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
      </View>

      {/* SVG TeruBot */}
      <TeruBot width={160} height={160} />

      {/* Text */}
      <Text style={styles.title}>Hello, I am TeruBot!</Text>
      <Text style={styles.subtitle}>
        Your smart companion,{"\n"}
        ready to uplift your day :)
      </Text>

      {/* Footer Navigation */}
      <FooterNav
        next="/(tabs)/onboarding/goal"
        color={GREEN} // 🌱 SAME GREEN
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  progressBar: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    bottom: 120,
  },
  progressSegment: {
    width: 10,
    height: 10,
    backgroundColor: "#d9d9d9",
    borderRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "rgba(0,0,0,0.58)",
    marginBottom: 40,
  },
});
