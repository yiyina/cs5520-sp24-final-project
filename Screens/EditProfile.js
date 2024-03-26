import { StyleSheet, Text, View, Modal, Pressable, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Octicons } from '@expo/vector-icons';
import Colors from '../Shared/Colors';
import { auth } from '../firebase-files/FirebaseSetup';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function EditProfile({ showProfile, onCancel }) {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [editProfilePressed, setEditProfilePressed] = useState(false);

    const user = auth.currentUser;

    useEffect(() => {
        fetchUserData();
    }
        , [userName, email]);

    useEffect(() => {
        console.log("UserName: ", userName);
        console.log("Email: ", email);
    }, [userName, email]);

    const fetchUserData = async () => {
        try {
            if (user.uid) {
                const userDocRef = await FirestoreService.getUserData(user.uid);
                if (userDocRef) {
                    setUserName(userDocRef.username);
                    setEmail(userDocRef.email);
                }
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    }

    const toggleEditProfile = async () => {
        console.log("Edit Profile Pressed: ", editProfilePressed);
        setEditProfilePressed(!editProfilePressed);
    }

    return (
        <Modal
            visible={showProfile}
            animationType="slide"
            transparent={true}
            onRequestClose={onCancel}>
            <View style={styles.modalContainer}>
                <Pressable onPress={onCancel} style={styles.fold}>
                    <Octicons name="chevron-down" size={24} color="white" />
                </Pressable>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Edit Profile</Text>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldText}>Username : </Text>
                        {editProfilePressed ?
                            <TextInput style={styles.fieldInput} value={userName} onChangeText={setUserName} />
                            :
                            <Text>{userName}</Text>
                        }
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldText}>Email : </Text>
                        {editProfilePressed ?
                            <TextInput style={styles.fieldInput} value={email} onChangeText={setEmail} />
                            :
                            <Text>{email}</Text>
                        }
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldText}>Password : </Text>
                        {editProfilePressed ? (
                            <TextInput
                                style={styles.fieldInput}
                                value={editProfilePressed ? password : "*********"}
                                onChangeText={setPassword}
                                onFocus={() => {
                                    if (editProfilePressed) {
                                        setPassword("");
                                    }
                                }}
                                secureTextEntry={true}
                            />
                        ) : (
                            <Text>*********</Text>
                        )}
                    </View>
                    <Pressable onPress={toggleEditProfile} style={styles.editProfile}>
                        {editProfilePressed ?
                            <>
                                <Feather name="save" size={24} color="black" />
                                <Text>Save</Text>
                            </>
                            :
                            <>
                                <MaterialCommunityIcons name="lead-pencil" size={24} color="black" />
                                <Text>Edit Profile</Text>
                            </>
                        }
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.LIGHT_YELLOW,
        height: '80%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderRadius: 55,
        borderWidth: 5,
        borderColor: Colors.DARK_YELLOW,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fold: {
        position: 'absolute',
        top: '18%',
        left: '50%',
        marginLeft: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.LIGHT_RED,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.DEEP_RED,
        marginBottom: 20,
        textAlign: 'center',
    },
    editProfile: {
        flexDirection: 'row',
        backgroundColor: Colors.DARK_YELLOW,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        margin: 20,
    },
    fieldText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    fieldInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: 'black',
        marginLeft: 10,
        padding: 5,
    },
})
