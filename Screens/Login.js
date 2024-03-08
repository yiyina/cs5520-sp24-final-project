import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Button from '../Shared/Button'
import Colors from '../Shared/Colors'
import Input from '../Shared/Input'
import { Ionicons } from '@expo/vector-icons'
import FirestoreService from '../firebase-files/FirebaseHelpers'

export default function Login({ navigation }) {
    const [usernameEmail, setUsernameEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nameEmailError, setnameEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [registerPressed, setRegisterPressed] = useState(false)

    useEffect(() => {
        if (usernameEmail) setnameEmailError('')
    }, [usernameEmail])
    useEffect(() => {
        if (password) setPasswordError('')
    }, [password])

    const handleNameEmailInput = (username) => {
        setUsernameEmail(username)
    }

    const handlePasswordInput = (password) => {
        setPassword(password)
    }

    const validateUsernameEmail = async (usernameOrEmail) => {
        try {
            const usernameExists = await FirestoreService.checkUsernameExists(usernameOrEmail);
            const emailExists = await FirestoreService.checkEmailExists(usernameOrEmail);
            
            if (usernameExists || emailExists) {
                setnameEmailError(""); // Reset error message if either username or email exists
                return true;
            } else {
                setnameEmailError("Username or Email does not exist");
                return false;
            }
        } catch (error) {
            console.error("Error validating username/email: ", error);
            throw error;
        }
    }

    const validatePassword = async (password) => {
        try {
            const passwordValid = await FirestoreService.checkPassword(usernameEmail, password);
            if (!passwordValid) {
                setPasswordError("Invalid Password");
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error validating password: ", error);
            throw error;
        }
    }

    const handleLoginPress = async () => {
        let valid = true

        const isNameEmailValid = await validateUsernameEmail(usernameEmail)
        if (!isNameEmailValid) {
            valid = false
        } else {
            const isPasswordValid = await validatePassword(password)
            if (!isPasswordValid) {
                valid = false
            }
        }

        if (valid) {
            // navigation.navigate('Home')
            console.log("login success")
        } else {
            console.log("login failed")
        }
    }

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
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Username / Email:</Text>
                <Input text={usernameEmail} handleInput={handleNameEmailInput} />
                <Text style={styles.errorText}>
                    {nameEmailError ? nameEmailError : ""}
                </Text>
                <Text style={styles.text}>Password:</Text>
                <View>
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
                <Button text="Register" textColor={Colors.BLUE} buttonPress={handleRegisterPress} />
                <Button text="Login" textColor={Colors.BLACK} buttonPress={handleLoginPress} />
            </View>
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
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 13,
        zIndex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
})