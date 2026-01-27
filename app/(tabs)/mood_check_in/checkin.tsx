import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import TeruIcon from "@/assets/icons/teru_icon_1.svg";
import ChatIcon from "../../../assets/icons/chat_icon_bis.svg";
import HomeIcon from "../../../assets/icons/home.svg";
import MoodIcon from "../../../assets/icons/mood.svg";
import WeatherIcon from "../../../assets/icons/weather.svg";

export default function ValidationScreen() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const handleStart = () => {
    // Navigate to the emotion selection screen (formerly checkin.tsx)
    router.push("/(tabs)/mood_check_in/emotion_selection");
  };

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E99F95', '#F2E8C0', '#A6D8C6']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <TeruIcon width={120} height={120} />
        </View>

        <Text style={styles.title}>
          Are you ready to {"\n"}lock your emotions?
        </Text>

        <Text style={styles.subtitle}>
          Take a moment to reflect before we begin.
        </Text>

        <Pressable
          onPress={handleStart}
          onPressIn={pressIn}
          onPressOut={pressOut}
          style={styles.buttonContainer}
        >
          <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
            <Text style={styles.buttonText}>I'm ready</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 100, // Make room for navbar
  },
  iconContainer: {
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#b8d4c6",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a2e26",
    letterSpacing: 0.5,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
});
