import React from "react";
import { StyleSheet, Text, View } from "react-native";
import EmotionsIntro from "../../../assets/icons/heart_goal_yellow.svg";
import FooterNav from "../composants/FooterNav";

const PURPLE = "#ECCDAB";

export default function Goal() {
  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressSegment} />
        <View style={[styles.progressSegment, { backgroundColor: PURPLE }]} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
      </View>

      {/* SVG */}
      <EmotionsIntro width={160} height={160} />

      {/* Text */}
      <Text style={styles.title}>Set Your Goal</Text>
      <Text style={styles.subtitle}>
        Take a moment to understand how you are feeling. Your emotions matter.
      </Text>

      {/* Footer Navigation */}
      <FooterNav
        previous="/(tabs)/onboarding/intro"
        next="/(tabs)/onboarding/weather"
        color={PURPLE} // 💜 page-specific color
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
    color: "#000",            // ✅ black text
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#000",            // ✅ black text
    marginBottom: 40,
  },
});

