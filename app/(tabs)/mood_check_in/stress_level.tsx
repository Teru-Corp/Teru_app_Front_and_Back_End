import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const STRESS_LEVELS = [
  { key: "peaceful", label: "Peaceful" },
  { key: "tense", label: "Slightly tense" },
  { key: "stressed", label: "Stressed" },
  { key: "overwhelmed", label: "Overwhelmed" },
];

export default function StressLevelPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { emotion, energy, connection } = params;
  const [selected, setSelected] = useState<string | null>(null);

  const handleFinish = () => {
    if (selected) {
      router.push({
        pathname: "./generation_weather",
        params: { emotion, energy, connection, stress: selected }
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/bg_welcome.png")}
        style={styles.background}
        resizeMode="cover"
      />

      <Text style={styles.subtitle}>
        Let’s observe your emotional weather
      </Text>

      <Text style={styles.title}>How stressed do you feel?</Text>

      <View style={styles.cloudsContainer}>
        {STRESS_LEVELS.map((level) => {
          const isActive = selected === level.key;

          return (
            <Pressable
              key={level.key}
              onPress={() => setSelected(level.key)}
              style={[
                styles.cloud,
                isActive && styles.cloudActive,
              ]}
            >
              <Text
                style={[
                  styles.cloudText,
                  isActive && styles.cloudTextActive,
                ]}
              >
                {level.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.previous}
          onPress={() => router.back()}
        >
          <Text style={styles.previousText}>← Previous</Text>
        </Pressable>

        <Pressable
          style={[
            styles.next,
            !selected && { opacity: 0.5 },
          ]}
          disabled={!selected}
          onPress={handleFinish}
        >
          <Text style={styles.nextText}>Finish →</Text>
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

  cloudsContainer: {
    marginTop: 90,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },

  cloud: {
    width: 160,
    height: 70,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  cloudActive: {
    backgroundColor: "rgba(180,180,180,0.7)",
  },

  cloudText: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
  },

  cloudTextActive: {
    color: "#000",
    fontWeight: "600",
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
