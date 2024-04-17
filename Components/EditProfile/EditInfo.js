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
import { ActivityIndicator } from 'react-native';
import Logout from './Logout';
import Notification from './Notification';

export default function EditInfo() {
    const { avatarUri } = getUpdatedUserData();
    const [showCamera, setShowCamera] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("**********");
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [hasUsernameError, setHasUsernameError] = useState(false);
    const [hasEmailError, setHasEmailError] = useState(false);
    const [hasPasswordError, setHasPasswordError] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [editProfilePressed, setEditProfilePressed] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        async function fetchUserData() {
            if (auth.currentUser) {
                const userData = await FirestoreService.getUserData();
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
        if (editProfilePressed) {
            if (usernameError || emailError || passwordError) {
                Alert.alert("Error", "Please correct the errors before saving.");
                return;
            }

            let isEmailAlreadyExists = false;
            try {
                const userData = await FirestoreService.getUserData();

                let fieldsToUpdate = {};
                let hasChanges = false;

                if (userData.username !== username) {
                    fieldsToUpdate.username = username;
                    hasChanges = true;
                }

                if (userData.email !== email) {
                    const emailExists = await FirestoreService.doesEmailExist(email);
                    if (emailExists) {
                        setEmailError("Email already exists. Please choose a different one.");
                        isEmailAlreadyExists = true;
                        return;
                    }
                    await FirestoreService.updateEmailForUser(user.uid, email);
                    // fieldsToUpdate.email = email;
                    hasChanges = true;
                }

                if (password !== "**********") {
                    fieldsToUpdate.password = password;
                    hasChanges = true;
                }

                if (hasChanges) {
                    setIsUploading(true);
                    await FirestoreService.updateDocuments(user.uid, fieldsToUpdate);
                    Alert.alert("Success", "Your data updated successfully.");
                } else {
                    Alert.alert("Info", "No changes.");
                }
            } catch (error) {
                console.error("Error updating user data: ", error);
                Alert.alert("Error", "An error occurred while updating your data.");
            } finally {
                if (!isEmailAlreadyExists && !usernameError && !emailError && !passwordError) {
                    setEditProfilePressed(false);
                    setIsUploading(false);
                }
            }
        } else {
            setEditProfilePressed(true);
        }
    };

    return (
        <View style={styles.modalContent}>
            <EditAvatar avatarUri={avatarUri} toggleCamera={toggleCamera} />
            <Notification />
            <Text style={styles.title}>Edit Profile</Text>
            <EditFields
                title="Username"
                value={username}
                onChange={setUsername}
                error={usernameError}
                setError={newError => {
                    setUsernameError(newError);
                    setHasUsernameError(!!newError);
                }}
                editProfilePressed={editProfilePressed}
            />
            <EditFields
                title="Email"
                value={email}
                onChange={setEmail}
                error={emailError}
                setError={newError => {
                    setEmailError(newError);
                    setHasEmailError(!!newError);
                }}
                editProfilePressed={editProfilePressed}
            />
            <Pressable
                onPress={toggleEditProfile}
                style={({ pressed }) => [
                    styles.editProfileButton,
                    {
                        backgroundColor: pressed
                            ? Colors.DARK_YELLOW_PRESSED
                            : Colors.TEXT_COLOR,
                        opacity: (usernameError || emailError || passwordError) ? 0.5 : 1
                    }
                ]}
                disabled={hasUsernameError || hasEmailError || hasPasswordError}
            >
                {editProfilePressed ?
                    <>
                        <Feather name="save" size={24} color={Colors.WHITE} />
                        <Text style={styles.buttonText}>Save</Text>
                    </>
                    :
                    <>
                        <MaterialCommunityIcons name="lead-pencil" size={24} color={Colors.WHITE} />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </>
                }
            </Pressable>
            <Logout />
            <CameraScreen
                showCamera={showCamera}
                onCancel={toggleCamera}
                onImageCaptured={(imageUri) => CameraService.handleImageCaptured(imageUri,'avatar')}
                type={'avatar'} />
            {isUploading &&
                <View style={styles.waitingView}>
                    <ActivityIndicator size="large" color={Colors.DEEP_RED} />
                </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: Colors.MAIN_BACKGROUND,
        height: '90%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 5,
        borderColor: Colors.BORDER_GOLD,
        overflow: 'visible',
        alignItems: 'center',
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.TEXT_COLOR,
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
    waitingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
})