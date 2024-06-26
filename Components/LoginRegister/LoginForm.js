import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import Input from '../../Shared/Input'
import Button from '../../Shared/Button'
import Colors from '../../Shared/Colors'
import { Ionicons } from '@expo/vector-icons'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase-files/FirebaseSetup';
import Card from '../../Shared/Card'

export default function LoginForm({ navigation, toggleFlip }) {
    const [usernameEmail, setUsernameEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nameEmailError, setNameEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loginPressed, setLoginPressed] = useState(false)

    // Clear the error message when the user starts typing
    useEffect(() => {
        if (usernameEmail) setNameEmailError('')
    }, [usernameEmail])
    useEffect(() => {
        if (password) setPasswordError('')
    }, [password])

    // Handle the input for username/email and password
    const handleNameEmailInput = (username) => {
        setUsernameEmail(username)
    }

    // Handle the input for password
    const handlePasswordInput = (password) => {
        setPassword(password)
    }

    // Handle the login button press
    const handleLoginPress = async () => {
        setNameEmailError("");
        setPasswordError("");
        setLoginPressed(!loginPressed);

        if (!usernameEmail || !password) {
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
        } finally {
            setLoginPressed(!loginPressed);
        }
    };

    const handleRegisterPress = () => {
        toggleFlip();
    }

    return (
        <Card>
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
                <Button
                    text="Login"
                    textColor={Colors.BLACK}
                    buttonPress={handleLoginPress}
                    defaultStyle={styles.loginButton}
                    pressedStyle={styles.pressloginButton}
                    containerStyle={styles.loginButton}
                />
                <View style={styles.registerContainer}>
                    <Text>Don't have an account?</Text>
                    <Button
                        text="Register"
                        textColor={Colors.BLUE}
                        buttonPress={handleRegisterPress}
                        textStyle={styles.registerText}
                    />
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: '10%',
        borderRadius: 20,
        width: Dimensions.get('window').width*0.8,
        backgroundColor: Colors.WHITE,
        opacity: 0.9,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    inputContainer: {
        paddingHorizontal: '5%',
        marginBottom: 10,
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
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    pressloginButton: {
        width: '80%',
        borderRadius: 10,
        backgroundColor: Colors.DARK_COLOR,
        shadowColor: Colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 10,
    },
    loginButton: {
        width: '80%',
        borderRadius: 10,
        backgroundColor: Colors.LIGHT_COLOR,
        shadowColor: Colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 10,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        textDecorationLine: 'underline',
    },
})