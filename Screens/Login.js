import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Button from '../Shared/Button'
import Colors from '../Shared/Colors'
import Input from '../Shared/Input'
import { Ionicons } from '@expo/vector-icons'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase-files/FirebaseSetup';

export default function Login({ navigation }) {
    const [usernameEmail, setUsernameEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nameEmailError, setNameEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [registerPressed, setRegisterPressed] = useState(false)

    useEffect(() => {
        if (usernameEmail) setNameEmailError('')
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

     const handleLoginPress = async () => {
        setNameEmailError("");
        setPasswordError("");

        if(!usernameEmail || !password) {
            if (!usernameEmail) setNameEmailError("Username or Email could not be empty");
            if (!password) setPasswordError("Password could not be empty");
            return;
        }
        try {
            let email = usernameEmail;
            if (!email.includes('@')) {
                Alert.alert("Please enter a valid email address");
                return;
            }

            if (email) {
                console.log(auth, email, password)
                await signInWithEmailAndPassword(auth, email, password);
                console.log("Login successful");
                navigation.navigate('Home');
                console.log(auth)
            } else {
                setNameEmailError("Username or Email does not exist");
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setNameEmailError("Username or Email does not exist");
            } else if (error.code === 'auth/wrong-password') {
                setPasswordError("Invalid Password");
            } else if (error.code === 'auth/too-many-requests') {
                setPasswordError("You've tried too many times, please try again later.");
            } else if (error.code === 'auth/invalid-credential') {
                setPasswordError("Invalid Password");
            } else if (error.code === 'auth/missing-password') {
                setPasswordError("Password could not be empty");
            }
        }
    };

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
                <Text style={styles.text}>Email:</Text>
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
        paddingTop: 100,
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
    errorText: {
        color: Colors.DARK_RED,
        height: 20,
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