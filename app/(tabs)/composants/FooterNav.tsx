import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

interface FooterNavProps {
  previous?: Parameters<ReturnType<typeof useRouter>["push"]>[0];
  next?: Parameters<ReturnType<typeof useRouter>["push"]>[0];
  nextLabel?: string;
  color?: string;      // button background (emotion color)
  textColor?: string;  // text color (readability)
}

export default function FooterNav({
  previous,
  next,
  nextLabel,
  color = "#b8d4c6",
  textColor = "#000",   // ✅ default BLACK text
}: FooterNavProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {previous && (
        <Pressable
          style={[styles.button, { backgroundColor: color }]}
          onPress={() => router.push(previous)}
        >
          <Text style={[styles.text, { color: textColor }]}>
            ← Previous
          </Text>
        </Pressable>
      )}

      {next && (
        <Pressable
          style={[styles.button, { backgroundColor: color }]}
          onPress={() => router.push(next)}
        >
          <Text style={[styles.text, { color: textColor }]}>
            {nextLabel ?? "Next →"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    width: "80%",
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
});
