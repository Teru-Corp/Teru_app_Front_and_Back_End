import { useCommunityWeather } from "@/hooks/useCommunityWeather";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import client from "../../../api/client";

import TeruBotWeather from "../../../assets/icons/icon_teru_face.svg";

import ChatIcon from "../../../assets/icons/chat_icon_bis.svg";
import HomeIcon from "../../../assets/icons/home.svg";
import MoodIcon from "../../../assets/icons/mood.svg";
import WeatherIcon from "../../../assets/icons/weather.svg";

import { useAuth } from "@/context/AuthContext";

export default function Weather() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  if (hour >= 18) greeting = "Good evening";

  const [personalWeather, setPersonalWeather] = React.useState({ temp: '--', label: 'Loading...' });
  const { data: communityData } = useCommunityWeather();

  // Fetch stats when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchPersonalWeather = async () => {
        try {
          const res = await client.get('/weather-stats');
          if (res.data.temperature !== null) {
            setPersonalWeather({
              temp: `${res.data.temperature}°C`,
              label: `Feeling ${res.data.label}`
            });
          } else {
            setPersonalWeather({ temp: '--', label: 'No Data' });
          }
        } catch (e) {
          console.error("Failed to fetch personal weather", e);
        }
      };
      fetchPersonalWeather();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      "Leaving the Garden?",
      "Are you sure you want to log out of the garden?",
      [
        {
          text: "Stay",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: logout,
          style: "destructive"
        }
      ]
    );
  };

  const bgColors = communityData?.colors || ['#E99F95', '#F2E8C0', '#A6D8C6'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={bgColors}
        style={styles.bg}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>{greeting},</Text>
            <Text style={styles.name}>{user?.nom || 'Teru'}</Text>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>




        {/* Title */}
        <Text style={styles.title}>
          What is your emotional weather today?
        </Text>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoWrapper}>
            <View style={[styles.glassCircle, { overflow: 'hidden' }]}>
              <TeruBotWeather width="100%" height="100%" />
            </View>
            {/* Teru's Speech Bubble */}
            <View style={styles.feelingBubble}>
              <Text style={styles.bubbleText}>{personalWeather.label}</Text>
            </View>
          </View>
        </View>



        {/* Community Sentiment Message */}




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
            <Text style={styles.actionText}>History</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/(tabs)/garden")}
          >
            <Text style={styles.actionText}>Community</Text>
          </Pressable>
        </View>

        {/* Bottom pill removed */}

        {/* Bottom pill removed */}

        {/* Bottom Navigation */}
        <View style={styles.navBar}>
          <Pressable onPress={() => router.replace("/(tabs)/principal_screen/weather1")} hitSlop={15} style={{ alignItems: 'center' }}>
            <HomeIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
            <View style={styles.activeLine} />
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

      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E99F95", // Match the gradient start color to prevent flash
  },

  mainCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  bg: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
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

  sentimentContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 25,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sentimentText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
  },

  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "white",
  },

  hero: {
    alignItems: "center",
    marginVertical: 0,
  },

  glassCircle: {
    width: 200,
    height: 210,
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
    marginBottom: 20,
    marginTop: 20, // Push it down a bit
    fontWeight: "600",
  },

  mainCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 30,
    padding: 24,
    marginTop: 30,
    marginBottom: 15,
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
    marginBottom: 20,
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

  logoWrapper: {
    width: 220,
    height: 220,
    position: 'relative',
  },
  feelingBubble: {
    position: "absolute",
    top: 20,
    right: -40,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderBottomLeftRadius: 2, // Speech bubble tail effect
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    minWidth: 100,
    alignItems: 'center',
    zIndex: 100,
  },
  bubbleText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
  },
  bottomText: {
    fontSize: 15,
    color: "#000",
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
    paddingBottom: 20, // for bottom safe area approximation
    backgroundColor: 'transparent', // Transparent as shown in ref, icons floating
    zIndex: 100, // Ensure high zIndex for clickability
  },
  activeLine: {
    width: 20,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 5,
  },
});
