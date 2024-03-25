import { StyleSheet, Text, View, Modal, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Octicons } from '@expo/vector-icons';
import Colors from '../Shared/Colors';
import { auth } from '../firebase-files/FirebaseSetup';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EditProfile({ showProfile, onCancel }) {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const user = auth.currentUser;
    
    useEffect(() => {
        console.log("UserName: ", userName);
        console.log("Email: ", email);
    }, [userName, email]);

    const fetchUserData = async () => {
        try {
            const userDocId = await FirestoreService.getUserDocId(user.uid);
            if (userDocId) {
                const userDocRef = await FirestoreService.getUserData(userDocId);
                if(userDocRef) {
                    setUserName(userDocRef.username);
                    setEmail(userDocRef.email);
                }
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
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
                    <Text>Username : {userName}</Text>
                    <Text>Email : {email}</Text>
                    <Pressable onPress={fetchUserData}>
                        <MaterialCommunityIcons name="lead-pencil" size={24} color="black" />
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
        backgroundColor: '#fff',
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
        backgroundColor: Colors.DEEP_RED,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.DEEP_RED,
        marginBottom: 10,
    },
    
})
