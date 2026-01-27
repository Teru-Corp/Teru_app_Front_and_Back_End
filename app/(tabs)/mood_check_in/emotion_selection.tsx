import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import ChatIcon from "../../../assets/icons/chat_icon_bis.svg";
import HomeIcon from "../../../assets/icons/home.svg";
import MoodIcon from "../../../assets/icons/mood.svg";
import WeatherIcon from "../../../assets/icons/weather.svg";

const emotions = ["Joyful", "Calm", "Anxious", "Sad", "Energetic"];
const { width } = Dimensions.get("window");

export default function WelcomePage() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Animations for buttons
  const prevScale = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;
  const nextTranslateY = useRef(new Animated.Value(0)).current;

  const currentStep = 1;
  const totalSteps = 5;
  const trackWidth = 120;
  const dotPosition = (trackWidth / (totalSteps - 1)) * currentStep;

  const handleNext = () => {
    if (!selectedEmotion) return;
    router.push({
      pathname: "./energy_level",
      params: { emotion: selectedEmotion },
    });
  };

  // Previous button animations
  const pressInPrev = () => {
    Animated.spring(prevScale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const pressOutPrev = () => {
    Animated.spring(prevScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  // Next button animations
  const pressInNext = () => {
    Animated.parallel([
      Animated.spring(nextScale, { toValue: 1.05, useNativeDriver: true }),
      Animated.spring(nextTranslateY, { toValue: -6, useNativeDriver: true }),
    ]).start();
  };
  const pressOutNext = () => {
    Animated.parallel([
      Animated.spring(nextScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.spring(nextTranslateY, { toValue: 0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E99F95', '#F2E8C0', '#A6D8C6']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
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
            onPress={() => setSelectedEmotion(emotion)}
            style={({ pressed }) => [
              styles.emotionButton,
              selectedEmotion === emotion && styles.selectedEmotionButton,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text
              style={[
                styles.emotionText,
                selectedEmotion === emotion && styles.selectedEmotionText,
              ]}
            >
              {emotion}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Footer buttons */}
      <View style={styles.footer}>
        {/* Previous */}
        <Pressable
          onPressIn={pressInPrev}
          onPressOut={pressOutPrev}
          onPress={() => router.back()}
        >
          <Animated.View style={[styles.previous, { transform: [{ scale: prevScale }] }]}>
            <Text style={styles.previousText}>← Previous</Text>
          </Animated.View>
        </Pressable>

        {/* Next */}
        <Pressable
          onPressIn={pressInNext}
          onPressOut={pressOutNext}
          onPress={handleNext}
          disabled={!selectedEmotion}
        >
          <Animated.View
            style={[
              styles.next,
              {
                transform: [
                  { scale: nextScale },
                  { translateY: nextTranslateY },
                ],
                opacity: selectedEmotion ? 1 : 0.4,
              },
            ]}
          >
            <Text style={styles.nextText}>Next →</Text>
          </Animated.View>
        </Pressable>
      </View>



      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.replace("/(tabs)/principal_screen/weather1")} hitSlop={15}>
          <HomeIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
        </Pressable>
        <Pressable onPress={() => router.replace("/(tabs)/mood_check_in/checkin")} hitSlop={15}>
          <MoodIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
        </Pressable>
        <Pressable onPress={() => router.replace("/(tabs)/garden")} hitSlop={15}>
          <WeatherIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
        </Pressable>
        <Pressable onPress={() => router.replace("/(tabs)/chat")} hitSlop={15}>
          <ChatIcon width={28} height={28} stroke="white" strokeWidth={1.5} fill="none" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E99F95" },
  background: { ...StyleSheet.absoluteFillObject },

  subtitle: { marginTop: 60, marginLeft: 30, fontSize: 20, color: "rgba(255,255,255,0.5)" },
  title: { marginTop: 80, textAlign: "center", fontSize: 25, color: "#fff", paddingHorizontal: 20 },

  emotionList: { marginTop: 60, alignItems: "center", gap: 20 },
  emotionButton: { width: 291, height: 67, borderRadius: 25, backgroundColor: "rgba(255,255,255,0.25)", justifyContent: "center", alignItems: "center" },
  selectedEmotionButton: { backgroundColor: "#b8d4c6", borderWidth: 2, borderColor: "#fff" },
  emotionText: { fontSize: 17, color: "#000" },
  selectedEmotionText: { fontWeight: "bold" },

  footer: { position: "absolute", bottom: 100, flexDirection: "row", width: "100%", justifyContent: "space-around" },

  previous: {
    width: 170,
    height: 50,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#b8d4c6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  previousText: { color: "#fff", fontSize: 15, fontWeight: "500" },

  next: {
    width: 185,
    height: 50,
    backgroundColor: "#b8d4c6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  nextText: { color: "#000", fontSize: 15, fontWeight: "500" },

  trackContainer: { position: "absolute", bottom: 50, width: 120, height: 6, alignSelf: "center", justifyContent: "center" },
  track: { position: "absolute", width: "100%", height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.3)" },
  activeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#b8d4c6", position: "absolute", top: -3 },

  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20, // for bottom safe area approximation
    backgroundColor: 'transparent', // Transparent as shown in ref, icons floating
    zIndex: 100, // Ensure high zIndex for clickability
  },
});
