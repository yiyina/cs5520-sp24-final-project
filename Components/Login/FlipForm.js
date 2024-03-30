import React, { useState } from 'react';
import { View, Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LoginForm from './LoginForm';

const FlipForm = () => {
    const [flipAnimation, setFlipAnimation] = useState(new Animated.Value(0));

    const toggleFlip = () => {
        const toValue = flipAnimation._value >= 90 ? 0 : 180;

        Animated.spring(flipAnimation, {
            toValue: toValue,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };
    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                <LoginForm toggleFlip={toggleFlip}/>
                {/* <TouchableOpacity onPress={toggleFlip}>
                    <Text>Login Form</Text>
                </TouchableOpacity> */}
            </Animated.View>

            <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>
                {/* 注册表单 */}
                <TouchableOpacity onPress={toggleFlip}>
                    <Text>Register Form</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        top: 300,
    },
    flipCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
    },
    flipCardBack: {
        position: 'absolute',
        top: 0,
    }
});

export default FlipForm;
