import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../Shared/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import CameraScreen from '../../Screens/CameraScreen';
import CameraService from '../../Services/CameraService';
import EditFields from './EditFields';
import EditAvatar from './EditAvatar';
import { getUpdatedUserData } from '../../Shared/updateUserData';

export default function EditInfo() {
    const { avatarUri, username, email } = getUpdatedUserData();
    const [showCamera, setShowCamera] = useState(false);
    const [password, setPassword] = useState("");
    const [editProfilePressed, setEditProfilePressed] = useState(false);

    useEffect(() => {
        if( avatarUri && avatarUri.uri ) {
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
    }

    return (
        <View style={styles.modalContent}>
            <EditAvatar avatarUri={avatarUri} toggleCamera={toggleCamera}/>
            <Text style={styles.title}>Edit Profile</Text>
            <EditFields title="Username" type={username} setType={username} editProfilePressed={editProfilePressed} />
            <EditFields title="Email" type={email} setType={email} editProfilePressed={editProfilePressed} />
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