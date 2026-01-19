import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Animated, Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

const emotions = ["Joyful", "Calm", "Anxious", "Sad", "Energetic"];
const { width } = Dimensions.get("window");

export default function WelcomePage() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const currentStep = 1; // index of current step (0-based)
  const totalSteps = emotions.length;

  // Animated position of the dot
  const trackWidth = 120; // width of the progress track
  const dotPosition = (trackWidth / (totalSteps - 1)) * currentStep;

  const handleNext = () => {
    if (selectedEmotion) {
      router.push({
        pathname: "./energy_level",
        params: { emotion: selectedEmotion }
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
        How is your garden of emotion {"\n"}today ? Check in to find out !
      </Text>

      <Text style={styles.title}>How are you feeling today ?</Text>

      {/* Emotion buttons */}
      <View style={styles.emotionList}>
        {emotions.map((emotion) => (
          <Pressable
            key={emotion}
            style={[
              styles.emotionButton,
              selectedEmotion === emotion && styles.selectedEmotionButton
            ]}
            onPress={() => setSelectedEmotion(emotion)}
          >
            <Text style={[
              styles.emotionText,
              selectedEmotion === emotion && styles.selectedEmotionText
            ]}>{emotion}</Text>
          </Pressable>
        ))}
      </View>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <Pressable
          style={styles.previous}
          onPress={() => router.back()}
        >
          <Text style={styles.previousText}>← Previous</Text>
        </Pressable>

        <Pressable
          style={[styles.next, !selectedEmotion && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={!selectedEmotion}
        >
          <Text style={styles.nextText}>Next →</Text>
        </Pressable>
      </View>

      {/* Modern progress indicator */}
      <View style={styles.trackContainer}>
        <View style={styles.track} />
        <Animated.View
          style={[
            styles.activeDot,
            { transform: [{ translateX: dotPosition }] },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  background: { ...StyleSheet.absoluteFillObject },
  subtitle: { marginTop: 60, marginLeft: 30, fontSize: 20, color: "rgba(255,255,255,0.5)" },
  title: { marginTop: 80, textAlign: "center", fontSize: 25, color: "#fff", paddingHorizontal: 20 },
  emotionList: { marginTop: 60, alignItems: "center", gap: 20 },
  emotionButton: { width: 291, height: 67, borderRadius: 25, backgroundColor: "rgba(255,255,255,0.25)", justifyContent: "center", alignItems: "center" },
  selectedEmotionButton: { backgroundColor: "#b8d4c6", borderWidth: 2, borderColor: "#fff" },
  emotionText: { fontSize: 17, color: "#000" },
  selectedEmotionText: { fontWeight: "bold" },
  footer: { position: "absolute", bottom: 100, flexDirection: "row", width: "100%", justifyContent: "space-around" },
  previous: { width: 170, height: 50, backgroundColor: "rgba(217,217,217,0.25)", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  previousText: { color: "#7f7e7e", fontSize: 15 },
  next: { width: 185, height: 50, backgroundColor: "#b8d4c6", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  nextText: { color: "#000", fontSize: 15 },

  // Modern progress bar
  trackContainer: {
    position: "absolute",
    bottom: 50,
    width: 120,
    height: 6,
    alignSelf: "center",
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#b8d4c6",
    position: "absolute",
    top: -3,
  },
});
