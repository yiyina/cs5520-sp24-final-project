import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../Shared/Colors';
import Avatar from '../../Shared/Avatar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { auth } from '../../firebase-files/FirebaseSetup';
import FirestoreService from '../../firebase-files/FirebaseHelpers';
import CameraScreen from '../../Screens/CameraScreen';
import CameraService from '../../Services/CameraService';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import EditFields from './EditFields';

export default function EditInfo({ avatarUri, setAvatarUri, userName, setUserName, email, setEmail, showCamera, setShowCamera }) {
    const [password, setPassword] = useState("");
    const [editProfilePressed, setEditProfilePressed] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        fetchUserData();
    }, [avatarUri, userName, email]);

    useEffect(() => {
        if( avatarUri && avatarUri.uri ) {
            console.log("EditInfo AvatarUri: ", avatarUri.uri);
        }
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

    const toggleCamera = () => {
        setShowCamera(!showCamera);
    }

    const handleDeleteAvatar = () => {
        Alert.alert(
            "Delete Avatar", // Alert Title
            "Are you sure you want to delete your avatar?", // Alert Message
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Avatar deletion canceled"), // Optionally handle the cancel action
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            if (user && user.uid) {
                                await FirestoreService.deleteAvatarFileFromStorage(user.uid);
                                await FirestoreService.removeAvatarFieldFromUser(user.uid);
                                setAvatarUri(null);
                                console.log("Avatar successfully deleted.");
                            }
                        } catch (error) {
                            console.error("Error deleting avatar: ", error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const toggleEditProfile = async () => {
        console.log("Edit Profile Pressed: ", editProfilePressed);
        setEditProfilePressed(!editProfilePressed);
    }

    return (
        <View style={styles.modalContent}>
            <View style={styles.avatarContainer}>
                <Avatar avatarUri={avatarUri} size={100} />
                {avatarUri && avatarUri.uri && (
                    <Pressable onPress={handleDeleteAvatar} style={styles.deleteButton}>
                        <AntDesign name="delete" size={24} color="red" />
                    </Pressable>
                )}
                <Pressable onPress={toggleCamera} style={styles.editAvatar}>
                    <FontAwesome name="camera-retro" size={24} color="black" />
                </Pressable>
            </View>

            <Text style={styles.title}>Edit Profile</Text>
            <EditFields title="Username" type={userName} setType={setUserName} editProfilePressed={editProfilePressed} />
            <EditFields title="Email" type={email} setType={setEmail} editProfilePressed={editProfilePressed} />
            <EditFields title="Password" type={password} setType={setPassword} editProfilePressed={editProfilePressed} />
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
            <CameraScreen
                showCamera={showCamera}
                onCancel={toggleCamera}
                onImageCaptured={(imageUri) => CameraService.handleImageCaptured(imageUri, setAvatarUri)}
                type={'avatar'} />
        </View>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: Colors.LIGHT_YELLOW,
        height: '90%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderRadius: 55,
        borderWidth: 5,
        borderColor: Colors.DARK_YELLOW,
        overflow: 'hidden',
        alignItems: 'center',
        paddingTop: 60,
    },
    avatarContainer: {
        borderWidth: 5,
        borderColor: Colors.WHITE,
        borderRadius: 100,
        marginBottom: 50,
    },
    editAvatar: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 5,
    },
    deleteButton: {
        position: 'absolute',
        bottom: -10,
        left: -10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 5,
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
})