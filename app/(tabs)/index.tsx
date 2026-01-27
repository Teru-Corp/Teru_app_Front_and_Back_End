// app/index.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TeruIndex from "../../assets/images/teru_index.svg";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const textFadeAnim = React.useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Staggered fade-in animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={[
          "#E19A93",
          "#E5B5A0",
          "#EDD7B8",
          "#F0EAC8",
          "#C8E5D5",
          "#9DCFBE",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>
        {/* Teru */}
        <Animated.View
          style={[
            styles.teruContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: floatAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <TeruIndex width={280} height={280} />
        </Animated.View>

        {/* Text */}
        <Animated.View
          style={[styles.textContainer, { opacity: textFadeAnim }]}
        >
          <Text style={styles.title}>Meet Terubot</Text>
          <Text style={styles.subtitle}>
            Your smart companion,{"\n"}ready to uplift your day
          </Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={{ opacity: buttonFadeAnim }}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/(tabs)/onboarding/intro")}
          >
            <LinearGradient
              colors={["#9DCFBE", "#7CB5A8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <View style={styles.buttonArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E99F95",
  },

  gradient: {
    position: "absolute",
    width,
    height,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 140,
    paddingBottom: 80,
    paddingHorizontal: 24,
  },

  teruContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    alignItems: "center",
    marginTop: -20,
  },

  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#2B2B2B",
    marginBottom: 14,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 17,
    color: "#4F4F4F",
    textAlign: "center",
    lineHeight: 25,
    fontWeight: "400",
  },

  button: {
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },

  buttonPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.15,
  },

  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 999,
    gap: 8,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  buttonArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  arrowText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});