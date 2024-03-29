import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from '../Shared/Input'
import Button from '../Shared/Button'
import FirestoreService from '../firebase-files/FirebaseHelpers'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase-files/FirebaseSetup';
import Colors from '../Shared/Colors'
import { Ionicons } from '@expo/vector-icons'
import { validateUsername, validateEmail, validatePassword } from '../Shared/InformationValidation';

export default function Register({ navigation }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);

    useEffect(() => {
        if (username) setUsernameError('')
    }, [username])
    useEffect(() => {
        if (email) setEmailError('')
    }, [email])
    useEffect(() => {
        if (password) setPasswordError('')
    }, [password])

    const handleUsernameInput = (username) => {
        setUsername(username)
    }

    const handleEmailInput = (email) => {
        setEmail(email)
    }

    const handlePasswordInput = (password) => {
        setPassword(password)
    }

    const handleResetPress = () => {
        setUsername('')
        setEmail('')
        setPassword('')
        setUsernameError('')
        setEmailError('')
        setPasswordError('')
    }

    const handleConfirmPress = async () => {
        setIsLoading(true);

        const usernameErrorText = validateUsername(username);
        const emailErrorText = validateEmail(email);
        const passwordErrorText = validatePassword(password);

        setUsernameError(usernameErrorText);
        setEmailError(emailErrorText);
        setPasswordError(passwordErrorText);

        if (usernameErrorText || emailErrorText || passwordErrorText) {
            setHasErrors(true);
            setIsLoading(false);
            return;
        }
        handleRegister();
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password,
                // { signIn: 'no' }
            );

            const userInfo = {
                username: username,
                email: email,
            };
            Alert.alert(
                "Registration Successful",
                "Let's start to Spin!",
                [{
                    text: "OK", onPress: () => {}
                }]
            );
            await FirestoreService.addUser(userInfo);
            console.log("Registration successful: ", navigation);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setEmailError("Email already in use");
            } else {
                Alert.alert("Error", "An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                    text="Reset"
                    buttonPress={handleResetPress}
                />
                <Button
                    text="Confirm"
                    buttonPress={handleConfirmPress}
                    disabled={hasErrors}
                    style={hasErrors ? styles.disabledButton : null} 
                    textStyle={hasErrors ? styles.disabledButtonText : null} 
                />
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
    disabledButton: {
        backgroundColor: '#ccc', 
    },
    disabledButtonText: {
        color: '#999',
    },
})