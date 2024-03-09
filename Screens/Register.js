import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from '../Shared/Input'
import Button from '../Shared/Button'
import FirestoreService from '../firebase-files/FirebaseHelpers'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase-files/FirebaseSetup';
import Colors from '../Shared/Colors'
import { Ionicons } from '@expo/vector-icons'

export default function Register({ navigation }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const validateUsername = async (username) => {
        const usernamePattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,}$/;
        if (!usernamePattern.test(username)) {
            setUsernameError("Invalid Username, should be at least 4 characters long with at least 1 letter");
            return false;
        }
    
        const exists = await FirestoreService.checkUsernameExists(username);
        if (exists) {
            setUsernameError("Username already exists");
            return false;
        }
    
        setUsernameError('');
        return true;
    };

    const validateEmail = async (email) => {
        const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/;
        if (!emailPattern.test(email)) {
            setEmailError("Invalid Email");
            return false;
        }
    
        const exists = await FirestoreService.checkEmailExists(email);
        if (exists) {
            setEmailError("Email already exists");
            return false;
        }
    
        setEmailError('');
        return true;
    };

    const validatePassword = (password) => {
        if (password.length < 6) {
            setPasswordError("Invalid Password, should be at least 6 characters long");
            return false;
        }
    
        setPasswordError('');
        return true;
    };

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
    
        const isUsernameValid = await validateUsername(username);
        const isEmailValid = await validateEmail(email);
        const isPasswordValid = validatePassword(password);
    
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            handleRegister();
        } else {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
    
            const userInfo = {
                username: username,
                email: email,
            };
            await FirestoreService.addUser(userInfo);
    
            Alert.alert(
                "Registration Successful",
                "Please login to continue.",
                [{ text: "OK", onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            console.error("Error registering user: ", error);
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
    }
})