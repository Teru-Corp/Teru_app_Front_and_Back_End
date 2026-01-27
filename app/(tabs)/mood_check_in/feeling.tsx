import Slider from "@react-native-community/slider";
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
  const [connection, setConnection] = useState(1);

  // animations
  const prevScale = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;
  const nextTranslateY = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    router.push({
      pathname: "./stress_level",
      params: { emotion, energy, connection },
    });
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
        How is your garden of emotion {"\n"}today?
      </Text>

      <Text style={styles.title}>How connected do you feel?</Text>

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

      <View style={styles.footer}>
        {/* Previous */}
        <Pressable
          onPressIn={pressInPrev}
          onPressOut={pressOutPrev}
          onPress={() => router.back()}
        >
          <Animated.View
            style={[
              styles.previous,
              { transform: [{ scale: prevScale }] },
            ]}
          >
            <Text style={styles.previousText}>← Previous</Text>
          </Animated.View>
        </Pressable>

        {/* Next */}
        <Pressable
          onPressIn={pressInNext}
          onPressOut={pressOutNext}
          onPress={handleNext}
        >
          <Animated.View
            style={[
              styles.next,
              {
                transform: [
                  { scale: nextScale },
                  { translateY: nextTranslateY },
                ],
              },
            ]}
          >
            <Text style={styles.nextText}>Next →</Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E99F95",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
  },

  subtitle: {
    marginTop: 60,
    marginLeft: 30,
    fontSize: 20,
    color: "#b8d4c6",
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
    flexWrap: "nowrap",
  },

  label: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    maxWidth: 80,
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
