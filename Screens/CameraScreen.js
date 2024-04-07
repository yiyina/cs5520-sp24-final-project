import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import CameraService from '../Services/CameraService';
import { auth } from '../firebase-files/FirebaseSetup';
import Colors from '../Shared/Colors';

export default function CameraScreen({ showCamera, onCancel, type, onImageCaptured }) {
    const [isUploading, setIsUploading] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);

    // ask for camera permission
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleImageAction = async (imageUri, type) => {
        setIsUploading(true);
        try {
            const uid = auth.currentUser.uid;
            let url = imageUri;
            // If the type is 'gallery', upload the image first to get a public URL
        if (type === 'gallery') {
            url = await FirestoreService.uploadToStorage(uid, imageUri, 'gallery');
        } else if (type === 'avatar') {
            url = await FirestoreService.uploadToStorage(uid, imageUri, 'avatar');
        }

        // Use the URL from storage if 'gallery', or direct URI if 'avatar' (assuming avatars are handled differently)
        if (type === 'gallery') {
            await FirestoreService.addPhotoToGallery(uid, url);
            Alert.alert('Your gallery has been successfully updated!');
        } else if (type === 'avatar') {
            await FirestoreService.updateUserAvatar(uid, url);
            Alert.alert('Your avatar has been successfully updated!');
        }

            onCancel();
            onImageCaptured(imageUri);
        } catch (error) {
            console.error("CameraScreen handleImageAction Error updating user avatar: ", error);
        } finally {
            setIsUploading(false);
        }
    }

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    if (isUploading) {
        return (
            <View style={styles.waitingView}>
                <ActivityIndicator size="large" color={Colors.DEEP_RED} />
            </View>
        );
    }

    return (
        <Modal
          visible={showCamera}
          animationType="slide"
          transparent={true}
        >
        <View style={styles.fullscreen}>
            <Camera style={styles.fullscreen} type={Camera.Constants.Type.back} ref={cameraRef}>
                <View style={styles.controlLayer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <FontAwesome5 name="window-close" size={36} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButtonOuter} onPress={async () => CameraService.takePicture(cameraRef, type, handleImageAction)}>
                        <View style={styles.captureButtonInner}>
                            <FontAwesome name="camera" size={40} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.galleryButton} onPress={async () => CameraService.pickImage(type, handleImageAction)}>
                        <FontAwesome name="photo" size={36} color="white" />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fullscreen: {
        flex: 1,
    },
    controlLayer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 50,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        alignSelf: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 30,
    },
    captureButtonOuter: {
        alignSelf: 'center',
        backgroundColor: 'transparent',
        padding: 4,
        borderRadius: 50,
    },
    captureButtonInner: {
        backgroundColor: Colors.DARK_YELLOW,
        padding: 20,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
    },
    captureButton: {
        alignSelf: 'center',
        backgroundColor: 'orange',
        padding: 20,
        borderRadius: 40,
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
    waitingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});