import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import FirestoreService from '../../firebase-files/FirebaseHelpers'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase-files/FirebaseSetup';
import Input from '../../Shared/Input'
import Button from '../../Shared/Button'
import Colors from '../../Shared/Colors'
import { validateUsername, validateEmail, validatePassword } from '../../Shared/InformationValidation';
import { Ionicons } from '@expo/vector-icons'
import Card from '../../Shared/Card'

export default function LoginForm({ navigation, toggleFlip }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);

    // Clear the error message when the user starts typing
    useEffect(() => {
        if (username) setUsernameError('')
    }, [username])
    useEffect(() => {
        if (email) setEmailError('')
    }, [email])
    useEffect(() => {
        if (password) setPasswordError('')
    }, [password])

    // Handle the input for username
    const handleUsernameInput = (username) => {
        setUsername(username)
    }

    // Handle the input for email
    const handleEmailInput = (email) => {
        setEmail(email)
    }

    // Handle the input for password
    const handlePasswordInput = (password) => {
        setPassword(password)
    }

    // Handle the reset button press
    const handleResetPress = () => {
        setUsername('')
        setEmail('')
        setPassword('')
        setUsernameError('')
        setEmailError('')
        setPasswordError('')
    }

    // Handle the login button press
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

    // Handle the registration process
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
                    text: "OK", onPress: () => { }
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
        <Card>
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
                <TouchableOpacity onPress={handleResetPress}>
                    <Text style={styles.resetButton}>Reset</Text>
                </TouchableOpacity>
                <Button
                    text="Register and Login"
                    buttonPress={handleConfirmPress}
                    disabled={hasErrors}
                    defaultStyle={styles.RegisterButton}
                    pressedStyle={styles.pressRegisterButton}
                    containerStyle={styles.RegisterButton}
                />
            </View>
            <View style={styles.loginContainer}>
                <Text>Already have an account?</Text>
                <Button
                    text="Login"
                    textColor={Colors.BLUE}
                    buttonPress={toggleFlip}
                    textStyle={styles.registerText}
                />
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
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
    resetButton: {
        color: Colors.DEEP_RED,
        fontWeight: 'bold',
    },  
    pressRegisterButton: {
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
    RegisterButton: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        textDecorationLine: 'underline',
    },
})