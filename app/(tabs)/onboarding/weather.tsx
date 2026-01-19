// app/(tabs)/onboarding/weather.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FooterNav from "../composants/FooterNav";
import WeatherIntro from "../../../assets/icons/cloud_green.svg";

const WEATHER_COLOR = "#B8D4C6";

export default function Weather() {
  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
        <View style={[styles.progressSegment, { backgroundColor: WEATHER_COLOR }]} />
        <View style={styles.progressSegment} />
      </View>

      {/* SVG */}
      <WeatherIntro width={160} height={160} />

      {/* Text */}
      <Text style={styles.title}>How’s the weather today?</Text>
      <Text style={styles.subtitle}>
        Visualize your mood as a beautiful, minimal landscape that reflects your inner world.
      </Text>

      {/* Footer Navigation */}
      <FooterNav
        previous="/(tabs)/onboarding/goal"
        next="/(tabs)/onboarding/community"
        color={WEATHER_COLOR}
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
