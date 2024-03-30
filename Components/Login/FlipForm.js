import React, { useState } from 'react';
import { View, Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

const FlipForm = () => {
    // 设置动画初始值
    const [flipAnimation, setFlipAnimation] = useState(new Animated.Value(0));

    // 处理翻转动画
    const toggleFlip = () => {
        // 根据当前状态确定将要转到的值
        const toValue = flipAnimation._value >= 90 ? 0 : 180;

        // 开始动画
        Animated.spring(flipAnimation, {
            toValue: toValue,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    // 插值，用于计算翻转角度
    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    // 设置前后视图的样式
    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };
    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                {/* 登录表单 */}
                <TouchableOpacity onPress={toggleFlip}>
                    <Text>Login Form</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
    },
    flipCard: {
        width: 300,
        height: 300,
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
