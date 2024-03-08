import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import Button from '../Shared/Button'
import Colors from '../Shared/Colors'

export default function Login({ navigation }) {
    const [registerPressed, setRegisterPressed] = useState(false)

    const handleRegisterPress = () => {
        setRegisterPressed(!registerPressed)
        console.log("register pressed", registerPressed)
        navigation.navigate('Register')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcom}>Welcome To</Text>
            <Image
                source={require('../assets/SpinLogo.png')}
                style={styles.logo} />
            <Button text="Register" textColor={Colors.BLUE} buttonPress={handleRegisterPress}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        alignItems: 'center',
    },
    welcom: {
        fontSize: 60,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
    },
    logo: {
        width: 300,
        height: 100,
    }
})