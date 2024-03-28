import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../Shared/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { auth } from '../../firebase-files/FirebaseSetup';
import FirestoreService from '../../firebase-files/FirebaseHelpers';
import CameraScreen from '../../Screens/CameraScreen';
import CameraService from '../../Services/CameraService';
import EditFields from './EditFields';
import EditAvatar from './EditAvatar';

export default function EditInfo({ avatarUri, userName, setUserName, email, setEmail, showCamera, setShowCamera }) {
    const [password, setPassword] = useState("");
    const [editProfilePressed, setEditProfilePressed] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if( avatarUri && avatarUri.uri ) {
            console.log("EditInfo AvatarUri: ", avatarUri.uri);
        }
        console.log("UserName: ", userName);
        console.log("Email: ", email);
    }, []);

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
            <EditAvatar avatarUri={avatarUri} handleDeleteAvatar={handleDeleteAvatar} toggleCamera={toggleCamera} />
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
                onImageCaptured={(imageUri) => CameraService.handleImageCaptured(imageUri)}
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
        borderWidth: 5,
        borderColor: Colors.DARK_YELLOW,
        overflow: 'hidden',
        alignItems: 'center',
        paddingTop: 60,
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