import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../Shared/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import CameraScreen from '../../Screens/CameraScreen';
import CameraService from '../../Services/CameraService';
import EditFields from './EditFields';
import EditAvatar from './EditAvatar';
import { getUpdatedUserData } from '../../Shared/updateUserData';
import FirestoreService from '../../firebase-files/FirebaseHelpers';
import { auth } from '../../firebase-files/FirebaseSetup';

export default function EditInfo() {
    const { avatarUri } = getUpdatedUserData();
    const [showCamera, setShowCamera] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("**********");
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [editProfilePressed, setEditProfilePressed] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        async function fetchUserData() {
            if (auth.currentUser) {
                const userData = await FirestoreService.getUserData(auth.currentUser.uid);
                if (userData) {
                    setUsername(userData.username || "");
                    setEmail(userData.email || "");
                }
            }
        }
        if (auth.currentUser) {
            fetchUserData();
        }
    }, []);

    useEffect(() => {
        if (avatarUri && avatarUri.uri) {
            console.log("EditInfo AvatarUri: ", avatarUri.uri);
        }
        console.log("UserName: ", username);
        console.log("Email: ", email);
    }, []);

    const toggleCamera = () => {
        setShowCamera(!showCamera);
    }

    const toggleEditProfile = async () => {
        console.log("Edit Profile Pressed: ", editProfilePressed);
        setEditProfilePressed(!editProfilePressed);
        if (editProfilePressed) {
            if (usernameError || emailError || passwordError) {
                Alert.alert("Please correct the errors before saving.");
                return;
            }
            try {
                const userData = await FirestoreService.getUserData(user.uid);
                const currentUsername = userData.username;
                const currentEmail = userData.email;

                const fieldsToUpdate = {
                    username: username,
                    email: email
                };

                if (password !== "**********") {
                    fieldsToUpdate.password = password;
                }

                if (currentUsername !== username || currentEmail !== email || password !== "**********") {
                    await FirestoreService.updateDocuments(user.uid, fieldsToUpdate);
                    Alert.alert("User data updated successfully.");
                } else {
                    Alert.alert("No changes.");
                }
            } catch (error) {
                console.log("Error updating user data: ", error);
            }
        } else {
            setEditProfilePressed(true);
        }
    }

    return (
        <View style={styles.modalContent}>
            <EditAvatar avatarUri={avatarUri} toggleCamera={toggleCamera} />
            <Text style={styles.title}>Edit Profile</Text>
            <EditFields
                title="Username"
                value={username}
                onChange={setUsername}
                error={usernameError}
                setError={setUsernameError}
                editProfilePressed={editProfilePressed}
            />
            <EditFields
                title="Email"
                value={email}
                onChange={setEmail}
                error={emailError}
                setError={setEmailError}
                editProfilePressed={editProfilePressed}
            />
            <EditFields
                title="Password"
                value={editProfilePressed ? password : "**********"}
                onChange={setPassword}
                error={passwordError}
                setError={setPasswordError}
                editProfilePressed={editProfilePressed}
            />
            <Pressable
                onPress={toggleEditProfile}
                style={({ pressed }) => [
                    styles.editProfileButton,
                    {
                        backgroundColor: pressed
                            ? Colors.DARK_YELLOW_PRESSED
                            : Colors.DARK_YELLOW,
                        opacity: (usernameError || emailError || passwordError) ? 0.5 : 1
                    }
                ]}
                disabled={usernameError || emailError || passwordError}
            >
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
    editProfileButton: {
        flexDirection: 'row',
        backgroundColor: Colors.DARK_YELLOW,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
    },
})