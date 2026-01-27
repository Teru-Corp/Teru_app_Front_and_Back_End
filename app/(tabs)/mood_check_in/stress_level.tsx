import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View
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

  // Animations for buttons
  const prevScale = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;
  const nextTranslateY = useRef(new Animated.Value(0)).current;

  const handleFinish = () => {
    if (selected) {
      router.push({
        pathname: "./generation_weather",
        params: { emotion, energy, connection, stress: selected },
      });
    }
  };

  const pressInPrev = () => {
    Animated.spring(prevScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const pressOutPrev = () => {
    Animated.spring(prevScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const pressInNext = () => {
    Animated.parallel([
      Animated.spring(nextScale, {
        toValue: 1.05,
        useNativeDriver: true,
      }),
      Animated.spring(nextTranslateY, {
        toValue: -6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pressOutNext = () => {
    Animated.parallel([
      Animated.spring(nextScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(nextTranslateY, {
        toValue: 0,
        friction: 4,
        useNativeDriver: true,
      }),
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
              style={[styles.cloud, isActive && styles.cloudActive]}
            >
              <Text style={[styles.cloudText, isActive && styles.cloudTextActive]}>
                {level.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        {/* Previous */}
        <Pressable
          onPressIn={pressInPrev}
          onPressOut={pressOutPrev}
          onPress={() => router.back()}
        >
          <Animated.View
            style={[styles.previous, { transform: [{ scale: prevScale }] }]}
          >
            <Text style={styles.previousText}>← Previous</Text>
          </Animated.View>
        </Pressable>

        {/* Finish */}
        <Pressable
          onPressIn={pressInNext}
          onPressOut={pressOutNext}
          onPress={handleFinish}
          disabled={!selected}
        >
          <Animated.View
            style={[
              styles.next,
              { transform: [{ scale: nextScale }, { translateY: nextTranslateY }] },
              !selected && { opacity: 0.5 },
            ]}
          >
            <Text style={styles.nextText}>Finish →</Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E99F95" },
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
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#b8d4c6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  previousText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
  },

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

  nextText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500",
  },
});
