import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from '../Shared/Input'
import Button from '../Shared/Button'
import FirestoreService from '../firebase-files/FirebaseHelpers'

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
    }, [username, password])
    
    const handleUsernameInput = (username) => {
        setUsername(username)
    }

    const handlePasswordInput = (password) => {
        setPassword(password)
    }

    const usernameValidation = (user) => {
        if (user.length < 5) {
            return false
        }
        return true
    }

    const handleResetPress = () => {
        console.log("Reset Pressed")
        setUsername('')
        setPassword('')
    }   

    const handleConfirmPress = () => {
        console.log("Username: ", username, ", Password: ", password)
        const user = {username: username, password: password}
        FirestoreService.addUser(user)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Username:</Text>
                <Input text={username} hanleInput={handleUsernameInput} />
                <Text style={styles.text}>Password:</Text>
                <Input text={password} hanleInput={handlePasswordInput} />
            </View>
            <View>
            <Button text="Reset" buttonPress={handleResetPress}/>
            <Button text="Confirm" buttonPress={handleConfirmPress}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 100,
        marginHorizontal: Dimensions.get('window').width * 0.05,
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop: 100,
        width: '100%',
        paddingHorizontal: '5%',
    },
    text: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
    }
})