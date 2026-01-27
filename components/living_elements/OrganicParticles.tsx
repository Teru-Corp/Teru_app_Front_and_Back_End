import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

type ParticleType = 'Firefly' | 'Pollen' | 'Rain' | 'Ash';

interface OrganicParticlesProps {
    type: ParticleType;
    count?: number;
    color?: string;
}

const Particle = ({ type, color }: { type: ParticleType, color: string }) => {
    // Random initial positions and properties
    const startX = useMemo(() => Math.random() * width, []);
    const startY = useMemo(() => Math.random() * height, []);
    const delay = useMemo(() => Math.random() * 2000, []);
    const customDuration = useMemo(() => {
        if (type === 'Rain') return 600 + Math.random() * 400;
        if (type === 'Firefly') return 6000 + Math.random() * 3000; // Slightly faster for perceptible motion
        if (type === 'Pollen') return 8000 + Math.random() * 4000;
        return 5000;
    }, [type]);

    const rainHeight = useMemo(() => 15 + Math.random() * 30, []);
    const initialOffset = useMemo(() => Math.random() * -(height + 200), []);

    // Random weave frequency and amplitude
    const weaveAmp = useMemo(() => 40 + Math.random() * 60, []);
    const weaveFreq = useMemo(() => 2 + Math.random() * 2, []);

    // Animation Values
    const progress = useSharedValue(0);
    const wobble = useSharedValue(0.5);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: customDuration, easing: Easing.inOut(Easing.linear) }),
            -1,
            false
        );

        if (type === 'Firefly' || type === 'Pollen') {
            wobble.value = withRepeat(
                withTiming(1, { duration: 2500 + Math.random() * 1500, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        }
    }, [type, customDuration]);

    const style = useAnimatedStyle(() => {
        let translateX = 0;
        let translateY = 0;
        let opacity = 1;

        if (type === 'Rain') {
            // Start from initial offset to ensure they are scattered vertically from frame 1
            const totalTravel = height + 200;
            translateY = initialOffset + (progress.value * totalTravel);

            // Wrap back to top
            if (translateY > height + 50) {
                translateY = -100 + (translateY % (height + 200));
            }

            translateX = startX; // Straight down like in emotion check-in
            opacity = 0.5 + Math.random() * 0.3;
        } else if (type === 'Firefly') {
            // Floating upwards across the whole screen like embers
            const curve = Math.sin(progress.value * Math.PI * weaveFreq);
            translateX = startX + (curve * weaveAmp);

            // Full height drift
            translateY = startY - (progress.value * (height + 200));
            // Loop vertically
            if (translateY < -100) translateY += (height + 200);

            opacity = 0.5 + (Math.sin(progress.value * Math.PI * 4) + 1) / 2 * 0.5;
        } else if (type === 'Pollen') {
            translateY = startY - (progress.value * height);
            if (translateY < -50) translateY += height + 100;
            translateX = startX + (wobble.value - 0.5) * 200;
            opacity = 0.6;
        }

        return {
            transform: [{ translateX }, { translateY }],
            opacity
        };
    });

    const size = type === 'Firefly' ? 5 : type === 'Pollen' ? 6 : type === 'Rain' ? 1.5 : 3;
    const shapeStyle = {
        width: size,
        height: type === 'Rain' ? rainHeight : size,
        borderRadius: size / 2,
        backgroundColor: color,
        position: 'absolute' as const,
        left: 0,
        top: 0,
        // Add glow for fireflies/sparks
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: type === 'Firefly' ? 1 : 0,
        shadowRadius: type === 'Firefly' ? 6 : 0,
    };

    return <Animated.View style={[shapeStyle, style]} />;
};

export default function OrganicParticles({ type, count = 20, color = "#FFF" }: OrganicParticlesProps) {
    const particles = useMemo(() => Array.from({ length: count }), [count]);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((_, i) => (
                <Particle key={i} type={type} color={color} />
            ))}
        </View>
    );
}
