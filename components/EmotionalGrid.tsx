import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GRID_SIZE = width * 0.8;
const DOT_SIZE = 40;

// Snap points: 20 points per axis = 400 points total
const SNAP_POINTS_X = Array.from({ length: 20 }, (_, i) => -1 + (i * 2) / 19);
const SNAP_POINTS_Y = Array.from({ length: 20 }, (_, i) => -1 + (i * 2) / 19);

interface EmotionalGridProps {
    onValueChange: (x: number, y: number) => void;
}

export default function EmotionalGrid({ onValueChange }: EmotionalGridProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const [currentXY, setCurrentXY] = useState({ x: 0, y: 0 });

    const snap = (val: number, points: number[]) => {
        return points.reduce((prev, curr) =>
            Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
        );
    };

    const gesture = Gesture.Pan()
        .onStart(() => {
            scale.value = withSpring(1.2);
        })
        .onUpdate((event) => {
            // Constrain to grid boundaries
            const halfGrid = GRID_SIZE / 2;
            let newX = event.translationX;
            let newY = event.translationY;

            // Clamp values
            translateX.value = Math.max(-halfGrid, Math.min(halfGrid, newX));
            translateY.value = Math.max(-halfGrid, Math.min(halfGrid, newY));
        })
        .onEnd(() => {
            scale.value = withSpring(1);

            const halfGrid = GRID_SIZE / 2;
            // Convert to -1 to 1 range
            const rawX = translateX.value / halfGrid;
            const rawY = -translateY.value / halfGrid; // Invert Y for screen coords

            const snappedX = snap(rawX, SNAP_POINTS_X);
            const snappedY = snap(rawY, SNAP_POINTS_Y);

            translateX.value = withSpring(snappedX * halfGrid);
            translateY.value = withSpring(-snappedY * halfGrid);

            runOnJS(setCurrentXY)({ x: snappedX, y: snappedY });
            runOnJS(onValueChange)(snappedX, snappedY);
        });

    const animatedDotStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ],
    }));

    const animatedBackgroundStyle = useAnimatedStyle(() => {
        // Background color based on quadrant
        // TL: Stormy, TR: Sunny, BL: Rainy, BR: Calm
        const color = interpolateColor(
            translateX.value,
            [-GRID_SIZE / 2, 0, GRID_SIZE / 2],
            ['#A78BFA', '#F3F4F6', '#FBBF24'] // Simple gradient for now
        );
        return { backgroundColor: color + '22' }; // Light transparency
    });

    return (
        <View style={styles.container}>
            {/* Background/Grid lines */}
            <Animated.View style={[styles.gridArea, animatedBackgroundStyle]}>
                {/* Horizontal Label Placeholder */}
                <View style={styles.labelsX}>
                    <Text style={styles.label}>Negative</Text>
                    <Text style={styles.label}>Positive</Text>
                </View>

                {/* Vertical Labels */}
                <Text style={[styles.label, styles.absLabel, { top: -30, alignSelf: 'center' }]}>High Energy</Text>
                <Text style={[styles.label, styles.absLabel, { bottom: -30, alignSelf: 'center' }]}>Low Energy</Text>

                {/* The Grid lines */}
                <View style={styles.axisX} />
                <View style={styles.axisY} />

                {/* The Dot */}
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.dot, animatedDotStyle]} />
                </GestureDetector>
            </Animated.View>

            <Text style={styles.statusText}>
                Feeling: {currentXY.x.toFixed(2)} | Energy: {currentXY.y.toFixed(2)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
    },
    gridArea: {
        width: GRID_SIZE,
        height: GRID_SIZE,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: '#fff',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 10,
    },
    axisX: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    axisY: {
        position: 'absolute',
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    labelsX: {
        position: 'absolute',
        width: '120%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
    },
    label: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '600',
    },
    absLabel: {
        position: 'absolute',
    },
    statusText: {
        marginTop: 40,
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    }
});
