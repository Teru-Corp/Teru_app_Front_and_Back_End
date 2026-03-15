// app/(tabs)/onboarding/community.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FooterNav from "../composants/FooterNav";
import CommunityIntro from "../../../assets/images/community_intro.svg";
import Weather from "../principal_screen/weather1";
const COMMUNITY_COLOR = "#6A7AA3";

export default function Community() {
  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
        <View
          style={[styles.progressSegment, { backgroundColor: COMMUNITY_COLOR }]}
        />
      </View>

      {/* SVG */}
      <CommunityIntro width={160} height={160} />

      {/* Text */}
      <Text style={styles.title}>Connect </Text>
      <Text style={styles.subtitle}>
        Connect with a community that shares how you feel.
      </Text>

      {/* Footer Navigation */}
      <FooterNav
        previous="/(tabs)/onboarding/goal"
        next="/(tabs)/principal_screen/weather1"
        color={COMMUNITY_COLOR}
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
    bottom: 120, // same as Weather page
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
