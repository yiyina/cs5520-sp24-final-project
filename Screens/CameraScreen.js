// CameraScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function CameraScreen({ onCancel }) {
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null);

    // ask for camera permission
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // function to take a picture
    const takePicture = async () => {
        if (cameraRef.current) {
            let photo = await cameraRef.current.takePictureAsync();
            console.log(photo);
            
        }
    };

    // show image picker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            console.log(result.uri);
            
        }
    };

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.fullscreen}>
            <Camera style={styles.fullscreen} type={Camera.Constants.Type.back} ref={cameraRef}>
                <View style={styles.controlLayer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <FontAwesome5 name="window-close" size={36} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButtonOuter} onPress={takePicture}>
                        <View style={styles.captureButtonInner}>
                            <FontAwesome name="camera" size={40} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                        <FontAwesome name="photo" size={36} color="white" />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
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
        backgroundColor: 'orange',
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
