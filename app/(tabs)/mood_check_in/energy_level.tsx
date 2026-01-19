import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function EnergyLevelPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { emotion } = params;
  const [energy, setEnergy] = useState(0.5); // 0 = low, 1 = high

  const handleNext = () => {
    router.push({
      pathname: "./feeling",
      params: { emotion, energy: energy } // Pass emotion and energy
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
      <Text style={styles.title}>How is your energy level?</Text>

      {/* Emoji scale */}
      <View style={styles.emojiRow}>
        <Text style={styles.emoji}>😔</Text>
        <Text style={styles.emoji}>🙂</Text>
        <Text style={styles.emoji}>😄</Text>
      </View>

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={energy}
        onValueChange={setEnergy}
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

  emojiRow: {
    marginTop: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    alignSelf: "center",
  },

  emoji: {
    fontSize: 32,
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
