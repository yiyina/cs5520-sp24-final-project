import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import CameraService from '../Services/CameraService';
import Colors from '../Shared/Colors';
import * as ImagePicker from 'expo-image-picker';

export default function CameraScreen({ showCamera, onCancel, type, placeDetails }) {
    const [isUploading, setIsUploading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        if (showCamera) {
            requestCameraPermission();
        }
    }, [showCamera]);

    const requestCameraPermission = async () => {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
    };

    const requestGalleryPermission = async () => {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === 'granted');
    };

    const handleCameraAction = async (action) => {
        if (action === CameraService.takePicture && !hasCameraPermission) {
            Alert.alert("Permission required", "Camera access is needed to take pictures.");
            return;
        }
        if (action === CameraService.pickImage && !hasGalleryPermission) {
            await requestGalleryPermission();
            if (hasGalleryPermission === false) {
                Alert.alert("Permission required", "Gallery access is needed to select pictures.");
                return;
            }
        }

        setIsUploading(true);
        const location = type === 'gallery' ? placeDetails?.name : undefined;
        await action(cameraRef, type, location).finally(() => {
            setIsUploading(false);
            onCancel();
        });
    };

    if (isUploading) {
        return (
            <View style={styles.fullscreen}>
                <ActivityIndicator size="large" color={Colors.DARK_COLOR} />
            </View>
        );
    }

    const renderContent = () => {
        if (!hasCameraPermission) {
            return (
                <View style={styles.waitingView}>
                    <Text></Text>
                </View>
            );
        }
        return (
            <Camera style={styles.fullscreen} type={Camera.Constants.Type.back} ref={cameraRef}>
                <View style={styles.controlLayer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <FontAwesome5 name="window-close" size={36} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButtonOuter} onPress={() => handleCameraAction(CameraService.takePicture)}>
                        <View style={styles.captureButtonInner}>
                            <FontAwesome name="camera" size={40} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.galleryButton} onPress={() => handleCameraAction(CameraService.pickImage)}>
                        <FontAwesome name="photo" size={36} color="white" />
                    </TouchableOpacity>
                </View>
            </Camera>
        );
    };

    return (
        <Modal visible={showCamera} animationType="slide" transparent={true}>
            <View style={styles.fullscreen}>
                {renderContent()}
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
    cancelButton: {
        alignSelf: 'center',
        padding: 4,
        borderRadius: 50,
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
    galleryButton: {
        alignSelf: 'center',
        padding: 4,
        borderRadius: 50,
    },
    waitingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});