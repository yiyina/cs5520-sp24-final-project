import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import CameraService from '../Services/CameraService'; // Assuming this is the correct import path
import Colors from '../Shared/Colors';

export default function CameraScreen({ showCamera, onCancel, type, onImageCaptured }) {
    const [isUploading, setIsUploading] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

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
                        <TouchableOpacity style={styles.captureButtonOuter} onPress={async () => {
                            setIsUploading(true); // Start uploading indicator
                            await CameraService.takePicture(cameraRef, type, CameraService.handleImageAction).finally(() => {
                                setIsUploading(false); // Stop uploading indicator
                                onCancel(); // Optionally close the camera modal
                            });
                        }}>
                            <View style={styles.captureButtonInner}>
                                <FontAwesome name="camera" size={40} color="white" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.galleryButton} onPress={async () => {
                            setIsUploading(true); // Start uploading indicator
                            await CameraService.pickImage(type, CameraService.handleImageAction).finally(() => {
                                setIsUploading(false); // Stop uploading indicator
                                onCancel(); // Optionally close the camera modal
                            });
                        }}>
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