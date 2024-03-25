// CameraScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import CameraService from '../Services/CameraService';
import { auth } from '../firebase-files/FirebaseSetup';
import Colors from '../Shared/Colors';

export default function CameraScreen({ showCamera, onCancel, type, onImageCaptured }) {
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
        const uid = auth.currentUser.uid;
        if (type === 'avatar') {
            await FirestoreService.updateUserAvatar(uid, imageUri);
        } else if (type === 'gallery') {
            await FirestoreService.addPhotoToGallery(uid, imageUri);
        }
        console.log("Updating user avatar to:", imageUri);
        onCancel();
        onImageCaptured(imageUri);
    }

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
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
                    <TouchableOpacity style={styles.captureButtonOuter} onPress={() => CameraService.takePicture(cameraRef, type, handleImageAction)}>
                        <View style={styles.captureButtonInner}>
                            <FontAwesome name="camera" size={40} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.galleryButton} onPress={() => CameraService.pickImage(type, handleImageAction)}>
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
});
