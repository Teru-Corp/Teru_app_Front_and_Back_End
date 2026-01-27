import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import client from "../../../api/client";

import TeruBotWeather from "../../../assets/icons/teru_icon 1.svg";
//import MoodCheck from "../mood_check_in/checkin";

// NAV ICONS (remplace par tes vrais SVG)
import ChatIcon from "../../../assets/icons/chat.svg";
import HomeIcon from "../../../assets/icons/home.svg";
import MoodIcon from "../../../assets/icons/mood.svg";
import WeatherIcon from "../../../assets/icons/weather.svg";

import { useAuth } from "@/context/AuthContext";

export default function Weather() {
  const router = useRouter();
  const { logout } = useAuth(); // Get logout function
  const [weather, setWeather] = React.useState({ temp: '--', label: 'Loading...' });

  // Fetch stats when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchWeather = async () => {
        try {
          const res = await client.get('/weather-stats');
          if (res.data.temperature !== null) {
            setWeather({
              temp: `${res.data.temperature}°C`,
              label: `Feeling ${res.data.label}`
            });
          } else {
            setWeather({ temp: '--', label: 'No Data' });
          }
        } catch (e) {
          console.error("Failed to fetch weather", e);
        }
      };
      fetchWeather();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/bg_welcome.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.name}>Teru</Text>
          </View>
          <Pressable onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.glassCircle}>
            <TeruBotWeather width={300} height={220} />
          </View>

          
        </View>

        {/* Title (NOT over the circle) */}
        <Text style={styles.title}>
          What is your emotional weather today?
        </Text>

        {/* Main action */}

        <Pressable
          style={({ pressed }) => [
            styles.mainCard,
            pressed && styles.mainCardPressed,
          ]}
          onPress={() => router.push("/(tabs)/mood_check_in/checkin")}
        >
          <View>
            <Text style={styles.cardSubtitle}>Start your day</Text>
            <Text style={styles.cardTitle}>Mood check-in</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>


        {/* Quick actions */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/(tabs)/history")}
          >
            <Text style={styles.actionText}>Weather History</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/(tabs)/chat")}
          >
            <Text style={styles.actionText}>Community</Text>
          </Pressable>
        </View>

        {/* Bottom pill */}
        <View style={styles.bottomPill}>
          <Text style={styles.bottomText}>{weather.label}</Text>
        </View>

        {/* Bottom navigation */}
        <View style={styles.nav}>
          <Pressable onPress={() => { }} hitSlop={10}>
            <HomeIcon width={24} height={24} />
          </Pressable>
          <Pressable onPress={() => router.push("/(tabs)/mood_check_in/checkin")} hitSlop={10}>
            <MoodIcon width={24} height={24} />
          </Pressable>
          <Pressable onPress={() => router.push("/(tabs)/history")} hitSlop={10}>
            <WeatherIcon width={24} height={24} />
          </Pressable>
          <Pressable onPress={() => router.push("/(tabs)/chat")} hitSlop={10}>
            <ChatIcon width={24} height={24} />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  mainCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  bg: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  welcome: {
    fontSize: 20,
    color: "rgba(255,255,255,0.6)",
  },

  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "white",
  },

  hero: {
    alignItems: "center",
    marginVertical: 24,
  },

  glassCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(217,217,217,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  percentage: {
    position: "absolute",
    top: 16,
    right: 70,
    alignItems: "center",
  },

  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#53E099",
    marginBottom: 4,
  },

  percentText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },

  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "600",
  },

  mainCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 30,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "white",
  },

  cardSubtitle: {
    fontSize: 15,
    color: "#7f7e7e",
  },

  cardTitle: {
    fontSize: 20,
    color: "#000",
    fontWeight: "500",
  },

  arrow: {
    fontSize: 28,
    color: "#7f7e7e",
  },

  actions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },

  actionCard: {
    flex: 1,
    height: 80,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    fontSize: 20,
    color: "#000",
  },

  bottomPill: {
    position: "absolute",
    bottom: 90,
    right: 24,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },

  bottomText: {
    fontSize: 15,
    color: "#000",
  },

  nav: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
