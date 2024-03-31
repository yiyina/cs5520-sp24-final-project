import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
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
            </ImageBackground>
            <View style={styles.mainContent}>
                <Text style={styles.welcome}>Spin To</Text>
                <Text style={styles.welcome}>Explore</Text>
                <View style={styles.overlay}></View>
                <FlipForm />
            </View>
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
        top: 100,
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        borderColor: 'white',
        position: 'absolute',
        top: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
})