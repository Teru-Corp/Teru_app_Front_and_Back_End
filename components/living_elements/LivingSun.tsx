import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, G, RadialGradient, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

interface LivingSunProps {
    size?: number;
    color?: string;
    intensity?: number;
}

export default function LivingSun({ size = 200, color = "#FFD700", intensity = 1 }: LivingSunProps) {
    // Shared Values for animations
    const rotation = useSharedValue(0);
    const breathe = useSharedValue(1);
    const rayPulse = useSharedValue(1);

    useEffect(() => {
        // Slow rotation
        rotation.value = withRepeat(
            withTiming(360, { duration: 60000, easing: Easing.linear }),
            -1,
            false // Don't reverse, just rotate continuously
        );

        // Breathing core
        breathe.value = withRepeat(
            withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );

        // Ray pulsing
        rayPulse.value = withRepeat(
            withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );
    }, []);

    const coreProps = useAnimatedProps(() => ({
        transform: [{ scale: breathe.value }]
    }));

    const haloProps = useAnimatedProps(() => ({
        transform: [{ scale: rayPulse.value }]
    }));



    const center = size / 2;
    const radius = size * 0.2;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Defs>
                    <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0" stopColor="#FFF" stopOpacity="1" />
                        <Stop offset="0.5" stopColor={color} stopOpacity="0.8" />
                        <Stop offset="1" stopColor={color} stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Outer Glow / Halo */}
                <AnimatedG originX={center} originY={center} animatedProps={haloProps} opacity={0.3}>
                    {/* Using circles for soft halo */}
                    <Circle cx={center} cy={center} r={radius * 2} fill={color} opacity={0.2} />
                </AnimatedG>

                {/* Core Sun - Glowing with Gradient */}
                <AnimatedG originX={center} originY={center} animatedProps={coreProps}>
                    <Circle cx={center} cy={center} r={radius} fill="url(#grad)" />
                    <Circle cx={center} cy={center} r={radius * 0.8} fill="#FFF" opacity={0.6} />
                </AnimatedG>
            </Svg>
        </View>
    );
}
