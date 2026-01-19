import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CONNECTION_STATES = [
  "Isolated",
  "Distant",
  "Connected",
  "Supported",
];

export default function ConnectionLevelPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { emotion, energy } = params;
  const [connection, setConnection] = useState(1); // 0 → 3

  const handleNext = () => {
    router.push({
      pathname: "./stress_level",
      params: { emotion, energy, connection: connection }
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/bg_welcome.png")}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        How is your garden of emotion {"\n"}today?
      </Text>

      {/* Title */}
      <Text style={styles.title}>How connected do you feel?</Text>

      {/* Connection labels */}
      <View style={styles.labelsRow}>
        {CONNECTION_STATES.map((label, index) => (
          <Text
            key={label}
            style={[
              styles.label,
              index === connection && styles.activeLabel,
            ]}
          >
            {label}
          </Text>
        ))}
      </View>

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={3}
        step={1}
        value={connection}
        onValueChange={setConnection}
        minimumTrackTintColor="#b8d4c6"
        maximumTrackTintColor="rgba(255,255,255,0.4)"
        thumbTintColor="#b8d4c6"
      />

      {/* Footer buttons */}
      <View style={styles.footer}>
        <Pressable
          style={styles.previous}
          onPress={() => router.back()}
        >
          <Text style={styles.previousText}>← Previous</Text>
        </Pressable>

        <Pressable
          style={styles.next}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Next →</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  background: { ...StyleSheet.absoluteFillObject },

  subtitle: {
    marginTop: 60,
    marginLeft: 30,
    fontSize: 20,
    color: "rgba(255,255,255,0.5)",
  },

  title: {
    marginTop: 80,
    textAlign: "center",
    fontSize: 25,
    color: "#fff",
    paddingHorizontal: 20,
  },

  labelsRow: {
    marginTop: 80,
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    maxWidth: 70,
    textAlign: "center",
  },

  activeLabel: {
    color: "#fff",
    fontWeight: "600",
  },

  slider: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },

  footer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },

  previous: {
    width: 170,
    height: 50,
    backgroundColor: "rgba(217,217,217,0.25)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  previousText: {
    color: "#7f7e7e",
    fontSize: 15,
  },

  next: {
    width: 185,
    height: 50,
    backgroundColor: "#b8d4c6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  nextText: {
    color: "#000",
    fontSize: 15,
  },
});
