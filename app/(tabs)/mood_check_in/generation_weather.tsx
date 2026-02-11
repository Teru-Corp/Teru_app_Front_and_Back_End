import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import client from "../../../api/client";
import TeruIcon from "../../../assets/icons/icon_teru_face.svg";

// Nav Icons
import ChatIcon from "../../../assets/icons/chat_icon_bis.svg";
import HomeIcon from "../../../assets/icons/home.svg";
import MoodIcon from "../../../assets/icons/mood.svg";
import WeatherIcon from "../../../assets/icons/weather.svg";

const { width, height } = Dimensions.get("window");

// Simple rain drop component
interface RainDropProps {
  delay: number;
  duration: number;
  startX: number;
}

const RainDrop = ({ delay, duration, startX }: RainDropProps) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: duration,
        delay: delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, height],
  });

  return (
    <Animated.View
      style={[
        styles.rainDrop,
        {
          left: startX,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

// Cloud Shape Component
const CloudShape = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.cloudContainer}>
    <View style={styles.cloudBubbleLeft} />
    <View style={styles.cloudBubbleRight} />
    <View style={styles.cloudBubbleTop} />
    <View style={styles.cloudBase}>
      {children}
    </View>
  </View>
);

// Mountain Component
const Mountain = ({ style }: { style: any }) => (
  <View style={[styles.mountain, style]} />
);

export default function EmotionalGardenWeather() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse params
  const emotion = params.emotion as string || "Calm";
  const energy = parseFloat(params.energy as string) || 0.5;
  const connection = parseFloat(params.connection as string) || 1;
  const stress = params.stress as string || "peaceful";
  const [communityMsg, setCommunityMsg] = useState("");

  const [saved, setSaved] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [floatAnim] = useState(new Animated.Value(0));
  const [flowerAnim] = useState(new Animated.Value(0));

  // Determine weather condition
  let weatherCondition = "Cloudy";
  if (["stressed", "overwhelmed"].includes(stress)) {
    weatherCondition = "Stormy";
  } else if (["Sad", "Anxious"].includes(emotion)) {
    weatherCondition = "Rainy";
  } else if (["Joyful", "Energetic"].includes(emotion)) {
    weatherCondition = "Sunny";
  }

  // Gardening Animation state
  const [isGardening, setIsGardening] = useState(false);
  const gardeningAnim = useRef(new Animated.Value(0)).current;

  // Calculate "Temperature" based on energy (0-1) -> 10-37°
  const temperature = Math.round(10 + (energy * 27));

  useEffect(() => {
    // Save to backend
    const saveMood = async () => {
      try {
        await client.post('/mood', {
          emotion,
          energy,
          connection,
          stress
        });
        setSaved(true);
      } catch (error: any) {
        console.error("Failed to save mood", error);
      }
    };
    saveMood();
  }, [emotion, energy]);

  const handleSendMessage = async () => {
    if (!communityMsg.trim()) return;
    try {
      await client.post('/message', { texte: communityMsg });

      // Start Gardening Animation
      setIsGardening(true);

      // Animation Sequence: Appear -> Burst
      Animated.sequence([
        // 1. Zoom In (Appear)
        Animated.spring(gardeningAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true
        }),
        // 2. Burst (Expand and Fade)
        Animated.timing(gardeningAnim, {
          toValue: 2,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        })
      ]).start(() => {
        router.push({
          pathname: "/(tabs)/garden",
          params: { newWord: communityMsg, animate: "true" }
        } as any);
        setTimeout(() => {
          setCommunityMsg("");
          setIsGardening(false);
          gardeningAnim.setValue(0);
        }, 500);
      });

    } catch (error) {
      console.error("Failed to send message", error);
      Alert.alert("Error", "Could not share your word.");
    }
  };

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Flower Growth Animation
    Animated.spring(flowerAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true
    }).start();

  }, []);

  // Visual variants
  const bloomScale = flowerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5 + (energy * 0.8)], // Scale based on energy
  });

  // Burst Animation Interpolations
  const bubbleScale = gardeningAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 3] // Zoom in to 1, then expand to 3 (Burst)
  });
  const bubbleOpacity = gardeningAnim.interpolate({
    inputRange: [0, 1, 1.2, 2],
    outputRange: [0, 1, 1, 0] // Fade out at end of burst
  });

  // Rain generator
  const renderRain = () => {
    if (weatherCondition !== "Rainy" && weatherCondition !== "Stormy") return null;
    const drops = [];
    for (let i = 0; i < 20; i++) {
      drops.push(
        <RainDrop
          key={i}
          startX={Math.random() * width}
          duration={800 + Math.random() * 800}
          delay={Math.random() * 1000}
        />
      );
    }
    return <View style={styles.rainContainer}>{drops}</View>;
  };

  const getGradientColors = (): [string, string, ...string[]] => {
    switch (weatherCondition) {
      case "Sunny": return ['#FF9A9E', '#FECFEF', '#F6D365'];
      case "Rainy": return ['#BDC3C7', '#2C3E50'];
      case "Stormy": return ['#1F1C2C', '#928DAB'];
      default: return ['#E99F95', '#F2E8C0', '#A6D8C6'];
    }
  };

  const getAffirmation = () => {
    switch (weatherCondition) {
      case "Sunny": return "Radiant energy flows through you";
      case "Rainy": return "Behind clouds, the sun still shines";
      case "Stormy": return "Roots grow deeper in the storm";
      default: return "Peace relies in the present moment";
    }
  };

  const isSunny = weatherCondition === "Sunny";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Landscape - Mountains */}
      <View style={styles.landscapeContainer}>
        <Mountain style={styles.mountainBack} />
        <Mountain style={styles.mountainFront} />
      </View>

      {renderRain()}

      {/* Gardening Animation Overlay (Bubble Burst) */}
      {isGardening && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <Animated.View style={{
            opacity: bubbleOpacity,
            transform: [{ scale: bubbleScale }]
          }}>
            <View style={styles.animationBubble}>
              <Text style={styles.animationBubbleText}>{communityMsg}</Text>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Growing Flower in the Garden */}
      <Animated.View style={[styles.flowerContainer, { transform: [{ scale: bloomScale }] }]}>
        {/* Using WeatherIntro as a flower placeholder, could be replaced by specific flower assets */}

      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.titlePrefix}>You feel </Text>
          <View style={styles.titleRow}>
            <Text style={styles.titleEmotion}>{weatherCondition.toLowerCase()}</Text>
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.titleSuffix}>today</Text>
          </View>
        </View>

        {/* Central Indicator */}
        {!saved ? (
          <Animated.View style={[styles.mainIndicatorContainer, { transform: [{ translateY: floatAnim }] }]}>
            {isSunny ? (
              <View style={styles.mainCircle}>
                <Text style={styles.temperature}>{temperature}°</Text>
              </View>
            ) : (
              <CloudShape>
                <Text style={styles.temperature}>{temperature}°</Text>
              </CloudShape>
            )}
          </Animated.View>
        ) : (
          <View style={styles.communitySection}>
            <Text style={styles.communityTitle}>Add to the Garden</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.cloudInput}
                value={communityMsg}
                onChangeText={setCommunityMsg}
                placeholder="A word for the collective..."
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <Pressable style={styles.addBtn} onPress={handleSendMessage}>
                <Text style={styles.addBtnText}>Bloom</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Affirmation Pill */}
        {!saved && (
          <View style={[styles.pillContainer, !isSunny && styles.pillContainerDark]}>
            <Text style={[styles.pillText, !isSunny && styles.pillTextDark]}>{getAffirmation()}</Text>
          </View>
        )}

        {/* Teru Community Callout */}
        <View style={styles.teruContainer}>
          <Animated.View style={styles.tooltip}>
            <View style={styles.tooltipBubble}>
              <Text style={styles.tooltipText}>Check the garden community!</Text>
              <View style={styles.tooltipArrow} />
            </View>
          </Animated.View>

          <Pressable onPress={() => router.push("/(tabs)/garden" as any)} style={styles.teruButton}>
            <TeruIcon width={60} height={60} />
          </Pressable>
        </View>

      </Animated.View>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.replace("/(tabs)/principal_screen/weather1")} hitSlop={15}>
          <HomeIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
        </Pressable>
        <Pressable onPress={() => router.replace("/(tabs)/mood_check_in/checkin")} hitSlop={15} style={{ alignItems: 'center' }}>
          <MoodIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
          <View style={styles.activeLine} />
        </Pressable>
        <Pressable onPress={() => router.replace("/(tabs)/garden" as any)} hitSlop={15}>
          <WeatherIcon width={28} height={28} fill="rgba(255,255,255,0.8)" />
        </Pressable>
        <Pressable onPress={() => router.replace("/(tabs)/chat" as any)} hitSlop={15}>
          <ChatIcon width={28} height={28} stroke="white" strokeWidth={1.5} fill="none" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E99F95" },
  background: { ...StyleSheet.absoluteFillObject },
  rainContainer: { ...StyleSheet.absoluteFillObject, zIndex: 5 },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    top: -20,
  },

  // Landscape
  landscapeContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'flex-end',
  },
  mountain: {
    position: 'absolute',
    bottom: 0,
    width: width * 1.5,
    height: 300,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '45deg' }],
    borderRadius: 50,
  },
  mountainBack: {
    left: -100,
    bottom: -150,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  mountainFront: {
    right: -50,
    bottom: -180,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  flowerContainer: {
    position: 'absolute',
    bottom: 150,
    left: width / 2 - 75,
    zIndex: 2,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
  },
  titlePrefix: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '400',
  },
  titleRow: {
    alignItems: 'center',
  },
  titleEmotion: {
    fontSize: 42,
    color: '#fff',
    fontWeight: '600',
    marginTop: 5,
  },
  titleSuffix: {
    fontSize: 42,
    color: '#fff',
    fontWeight: '600',
  },

  // Sunny Circle
  mainIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    height: 250,
  },
  mainCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  // Cloud Shape
  cloudContainer: {
    width: 220,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloudBase: {
    width: 200,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
  cloudBubbleLeft: {
    position: 'absolute',
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 45,
    bottom: 30,
    left: 20,
    zIndex: 1,
  },
  cloudBubbleRight: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 40,
    bottom: 30,
    right: 25,
    zIndex: 1,
  },
  cloudBubbleTop: {
    position: 'absolute',
    width: 110,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 55,
    bottom: 50,
    alignSelf: 'center',
    zIndex: 1,
  },

  temperature: {
    fontSize: 64,
    fontWeight: '300',
    color: '#1a1a1a',
    zIndex: 10,
  },

  pillContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 40,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  pillContainerDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  pillText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  pillTextDark: {
    color: '#000',
  },

  teruContainer: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    alignItems: 'flex-end',
  },
  tooltip: {
    marginBottom: 10,
    marginRight: 10,
  },
  tooltipBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    maxWidth: 150,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    right: 20,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
  },
  teruButton: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    // If background needed: backgroundColor: 'rgba(255,255,255,0.1)',
  },
  communitySection: {
    padding: 30,
    backgroundColor: 'rgba(255,255,254,0.15)',
    borderRadius: 30,
    width: width * 0.85,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  communityTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  cloudInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  addBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  addBtnText: {
    color: '#1a1a2e',
    fontWeight: '800',
    fontSize: 14,
  },
  activeLine: {
    width: 20,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 5,
  },

  // Animation Elements
  animationBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowRadius: 25,
    shadowOpacity: 0.6,
    elevation: 10,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationBubbleText: {
    color: '#1a1a2e',
    fontSize: 28,
    fontWeight: '800',
    fontStyle: 'italic',
    textAlign: 'center',
  }
});
