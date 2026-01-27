import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Polyline } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface LivingLightningProps {
    intensity?: number; // 0 to 1
    frequency?: number; // ms delay base
    color?: string;
}

export default function LivingLightning({ intensity = 1, frequency = 5000, color = "#E0FFFF" }: LivingLightningProps) {
    const flashOpacity = useSharedValue(0);
    const [points, setPoints] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let timeout: any;

        const triggerFlash = () => {
            // Generate random lightning path
            const startX = Math.random() * width;
            const segments = 10;
            let path = `${startX},0`;
            let currentX = startX;
            let currentY = 0;

            for (let i = 0; i < segments; i++) {
                currentX += (Math.random() - 0.5) * 100; // jagged x
                currentY += height / segments;
                path += ` ${currentX},${currentY}`;
            }
            setPoints(path);
            setVisible(true);

            // Flash Screen
            flashOpacity.value = withSequence(
                withTiming(0.6 * intensity, { duration: 50 }),
                withTiming(0, { duration: 250 })
            );

            // Hide bolt after flash
            setTimeout(() => setVisible(false), 300);

            // Next flash
            const nextDelay = Math.random() * frequency + 2000;
            timeout = setTimeout(triggerFlash, nextDelay);
        };

        timeout = setTimeout(triggerFlash, 2000); // Initial delay

        return () => clearTimeout(timeout);
    }, [intensity, frequency]);

    const flashStyle = useAnimatedStyle(() => ({
        opacity: flashOpacity.value,
        backgroundColor: 'white',
        ...StyleSheet.absoluteFillObject
    }));

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Screen Flash Overlay */}
            <Animated.View style={flashStyle} />

            {/* Lightning Bolt */}
            {visible && (
                <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
                    <Polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Glow effect duplicate */}
                    <Polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeOpacity="0.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            )}
        </View>
    );
}
