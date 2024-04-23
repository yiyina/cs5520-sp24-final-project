import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import FlipCard from 'react-native-flip-card';

// Component to flip between login and register forms
const FlipForm = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const toggleFlip = () => setIsFlipped(!isFlipped);

    return (
        <View style={styles.container}>
            <FlipCard 
                flip={isFlipped}
                flipHorizontal={true}
                flipVertical={false}
                clickable={false} 
                perspective={1000}
                style={styles.flipCardContainer}
            >
                <LoginForm toggleFlip={toggleFlip} />

                <RegisterForm toggleFlip={toggleFlip} />
            </FlipCard>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 100,
    },
    flipCardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FlipForm;
