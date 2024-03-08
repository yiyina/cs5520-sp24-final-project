import { Dimensions, StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from '../Shared/Input'
import Button from '../Shared/Button'
import FirestoreService from '../firebase-files/FirebaseHelpers'
import Colors from '../Shared/Colors'
import { Ionicons } from '@expo/vector-icons'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (username) setUsernameError('')
        if (email) setEmailError('')
        if (password) setPasswordError('')
    }, [email, password])

    const handleUsernameInput = (username) => {
        setUsername(username)
    }

    const handleEmailInput = (email) => {
        setEmail(email)
    }

    const handlePasswordInput = (password) => {
        setPassword(password)
    }

    const validateUsername = (username) => {
        const usernamePattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/
        return usernamePattern.test(username)
    }

    const validateEmail = (email) => {
        // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
        return emailPattern.test(email)
    }

    const validatePassword = (password) => {
        return password.length >= 6
    }

    const handleResetPress = () => {
        setUsername('')
        setEmail('')
        setPassword('')
        setUsernameError('')
        setEmailError('')
        setPasswordError('')
    }

    const handleConfirmPress = () => {
        let isValid = true;

        if (!validateUsername(username)) {
            setUsernameError("Invalid Username")
            isValid = false
        } else {
            setUsernameError('')
        }

        if (!validateEmail(email)) {
            setEmailError("Invalid Email")
            isValid = false
        } else {
            setEmailError('')
        }

        if (!validatePassword(password)) {
            setPasswordError("Invalid Password")
            isValid = false
        } else {
            setPasswordError('')
        }

        if (isValid) {
            handleRegister();
        }
    }

    const handleRegister = async () => {
        try {
            const user = {
                username: username,
                email: email,
                password: password
            }
            const id = await FirestoreService.addUser(user);
            console.log("User added with ID: ", id);
            console.log("Username: ", username, ", Email: ", email, ", Password: ", password)
            FirestoreService.addUser(user)
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Username:</Text>
                <Input text={username} handleInput={handleUsernameInput} />
                <Text style={styles.errorText}>
                    {usernameError ? usernameError : ""}
                </Text>
                <Text style={styles.text}>Email:</Text>
                <Input text={email} handleInput={handleEmailInput} />
                <Text style={styles.errorText}>
                    {emailError ? emailError : ""}
                </Text>
                <Text style={styles.text}>Password:</Text>
                <View style={styles.passwordInputContainer}>
                    <Input
                        text={password}
                        handleInput={handlePasswordInput}
                        secureTextEntry={!showPassword}
                    />
                    <Text style={styles.errorText}>
                        {passwordError ? passwordError : ""}
                    </Text>
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button text="Reset" buttonPress={handleResetPress} />
                <Button text="Confirm" buttonPress={handleConfirmPress} />
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
    passwordInputContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
    },
    text: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    errorText: {
        color: Colors.DARK_RED,
        height: 20,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 13,
        zIndex: 1,
    }
})