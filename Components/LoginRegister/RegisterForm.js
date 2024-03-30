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
        <View intensity={10} tint="dark" style={styles.container}>
            {/* <Text style={styles.title}>Register</Text> */}
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: -170,
        paddingVertical: '10%',
        borderRadius: 20,
        width: '80%',
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
    resetButton: {
        color: Colors.DEEP_RED,
        fontWeight: 'bold',
    },  
    pressRegisterButton: {
        width: '80%',
        borderRadius: 10,
        backgroundColor: Colors.DARK_YELLOW,
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
        backgroundColor: Colors.LIGHT_YELLOW,
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