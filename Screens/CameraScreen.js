import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import CameraService from '../Services/CameraService'; 
import Colors from '../Shared/Colors';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen({ showCamera, onCancel, type, placeDetails }) {
    const [isUploading, setIsUploading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const cameraRef = useRef(null);

    // Request camera permission
    const requestCameraPermission = async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        } catch (error) {
            console.error("Failed to request camera permission: ", error);
            Alert.alert("Permission Error", "Failed to request camera permission.");
        }
    };

    // Request gallery permission only when hasCameraPermission is null
    if (showCamera && hasCameraPermission === null) {
        requestCameraPermission();
    }

    // Handle the camera button press event to take a picture
    const handleCameraButton = async () => {
        setIsUploading(true);
        try {
            const location = type === 'gallery' ? placeDetails?.name : undefined;
            await CameraService.takePicture(cameraRef, type, location);
        } catch (error) {
            console.error("Failed to take a picture: ", error);
            Alert.alert("Capture Error", "Failed to take a picture.");
        } finally {
            setIsUploading(false);
            onCancel();
        }
    };

    // Handle the gallery button press event to pick an image from the gallery
    const handleGalleryButton = async () => {
        if (hasGalleryPermission !== true) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Access to gallery was denied.");
                return; 
            }
            setHasGalleryPermission(status === 'granted');
        }
    
        try {
            // setIsUploading(true);
            const location = type === 'gallery' ? placeDetails?.name : undefined;
            await CameraService.pickImage(type, location);
        } catch (error) {
            console.error("Failed to pick an image: ", error);
            Alert.alert("Gallery Error", "Failed to pick an image.");
        } finally {
            // setIsUploading(false);
            onCancel(); // Optionally close the camera modal
        }
    };

    // Show a waiting view
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
                {hasCameraPermission ? (
                    <Camera style={styles.fullscreen} type={Camera.Constants.Type.back} ref={cameraRef}>
                        <View style={styles.controlLayer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                <FontAwesome5 name="window-close" size={36} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.captureButtonOuter} onPress={handleCameraButton}>
                                <View style={styles.captureButtonInner}>
                                    <FontAwesome name="camera" size={40} color="white" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.galleryButton} onPress={handleGalleryButton}>
                                <FontAwesome name="photo" size={36} color="white" />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                ) : (
                    <ActivityIndicator size="large" color={Colors.DEEP_RED} />
                )}
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
        backgroundColor: Colors.DARK_COLOR,
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