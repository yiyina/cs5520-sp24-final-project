import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import FlipForm from '../Components/LoginRegister/FlipForm'

export default function LoginRegister() {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
            <ImageBackground
                source={require('../assets/main_background.jpg')}
                style={styles.container}>
                <View style={styles.mainContent}>
                    <Text style={styles.welcome}>Spin To</Text>
                    <Text style={styles.welcome}>Explore</Text>
                    <ScrollView 
                        style={styles.scrollContainer}
                        bounces={false}
                        alwaysBounceVertical={false}
                        overScrollMode="never"
                    >
                        <View style={styles.overlay}></View>
                        <FlipForm />
                        {Array.from({ length: 2 }, (_, i) => (
                            <Text key={i} style={{ marginTop: 50, padding: 10, fontSize: 16 }}></Text>
                        ))}
                    </ScrollView>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.WHITE,
        opacity: 0.4,
        top: 50,
    },
    welcome: {
        fontSize: 50,
        textAlign: 'center',
        fontWeight: 'bold',
        color: Colors.WHITE,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    mainContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: '10%',
        height: '90%', 
    },
    scrollContainer: {
        flex: 1, 
        width: '100%',
    }
})
