import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import FlipForm from '../Components/LoginRegister/FlipForm'

export default function LoginRegister() {

    return (
        <ImageBackground
            source={require('../assets/main_background.jpg')}
            style={styles.container}>
            <Text style={styles.welcome}>Spin To</Text>
            <Text style={styles.welcome}>Explore</Text>
            <View style={styles.overlay}></View>
            <FlipForm />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.WHITE,
        opacity: 0.4,
        top: 250,
    },
    welcome: {
        fontSize: 50,
        textAlign: 'center',
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontFamily: 'Arial',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    logo: {
        width: 300,
        height: 100,
    },
})