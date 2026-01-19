import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import client from "../../../api/client";
import WeatherIntro from "../../../assets/images/weather_intro.svg";

const { width, height } = Dimensions.get("window");

const EMOTION_MAP: Record<string, number> = {
  "Joyful": 1,
  "Calm": 0.5,
  "Energetic": 0.5,
  "Anxious": -0.5,
  "Sad": -1
};

export default function EmotionalGardenWeather() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse params (they come as strings)
  const emotion = params.emotion as string || "Calm";
  const energy = parseFloat(params.energy as string) || 0.5;
  const connection = parseFloat(params.connection as string) || 1;
  const stress = params.stress as string || "peaceful";

  const [sunAnim] = useState(new Animated.Value(0));
  const [cloudAnim] = useState(new Animated.Value(0));
  const [flowerAnim] = useState(new Animated.Value(0));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Save to backend
    const saveMood = async () => {
      try {
        // Send the raw data to the backend
        await client.post('/mood', {
          emotion,
          energy,
          connection,
          stress
        });
        setSaved(true);
      } catch (error: any) {
        console.error("Failed to save mood", error);
        alert(`Failed to save mood: ${error.response?.data?.error || error.message}`);
      }
    };
    saveMood();
  }, [emotion, energy]);

  useEffect(() => {
    // Sun gently moves up and down
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnim, { toValue: 10, duration: 2000, useNativeDriver: true }),
        Animated.timing(sunAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Clouds drift horizontally
    Animated.loop(
      Animated.sequence([
        Animated.timing(cloudAnim, { toValue: width * 0.6, duration: 8000, useNativeDriver: true }),
        Animated.timing(cloudAnim, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    ).start();

    // Flower blooming based on energy + connection
    Animated.timing(flowerAnim, {
      toValue: energy + connection / 4, // 0-1
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate bloom scale
  const bloomScale = flowerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.3],
  });

  // Determine sun intensity color
  const sunColor = emotion === "Joyful" ? "#FFD700" : "#FFE066";

  // Determine cloud opacity based on stress (stress isn't a number in params, map string)
  const stressLevel = ["peaceful", "tense", "stressed", "overwhelmed"].indexOf(stress);
  const cloudOpacity = 0.2 + (stressLevel / 3) * 0.5; // 0.2-0.7

  return (
    <View style={styles.container}>
      {/* Sky background */}
      <ImageBackground
        source={require("../../../assets/images/bg_welcome.png")} // optional dreamy background
        style={styles.background}
      />

      {/* Sun */}
      <Animated.View
        style={[
          styles.sun,
          { backgroundColor: sunColor, transform: [{ translateY: sunAnim }] },
        ]}
      />

      {/* Clouds */}
      <Animated.View
        style={[
          styles.cloud,
          {
            opacity: cloudOpacity,
            transform: [{ translateX: cloudAnim }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.cloud,
          { opacity: cloudOpacity * 0.8, top: 120, transform: [{ translateX: Animated.add(cloudAnim, 50) }] },
        ]}
      />

      {/* Flower */}
      <Animated.View
        style={[
          styles.flower,
          { transform: [{ scale: bloomScale }] },
        ]}
      >
        <WeatherIntro
          width={100}
          height={100}
          style={styles.flowerImg}
        />
      </Animated.View>

      {/* Optional overlay text */}
      <Text style={styles.title}>Your Emotional Garden Today</Text>

      {saved && <Text style={styles.savedText}>Check-in Saved!</Text>}

      <Pressable style={styles.homeButton} onPress={() => router.replace("/(tabs)")}>
        <Text style={styles.homeButtonText}>Return Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#87CEEB" },
  background: { ...StyleSheet.absoluteFillObject },

  sun: {
    position: "absolute",
    top: 50,
    left: width * 0.7,
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },

  cloud: {
    position: "absolute",
    top: 80,
    left: 0,
    width: 120,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 30,
  },

  flower: {
    position: "absolute",
    bottom: 50,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  flowerImg: {
    width: 100,
    height: 100,
  },

  title: {
    position: "absolute",
    top: 40,
    width: "100%",
    textAlign: "center",
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },
  savedText: {
    position: 'absolute',
    bottom: 120,
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  homeButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#b8d4c6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
