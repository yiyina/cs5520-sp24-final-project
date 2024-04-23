import { Platform, StyleSheet, ScrollView, TouchableOpacity, Modal, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import PlaceDetailItem from './PlaceDetailItem';
import Colors from '../../Shared/Colors';
import GoogleMapView from './GoogleMapView';
import { Linking } from 'react-native';
import CameraScreen from '../../Screens/CameraScreen';
import CameraService from '../../Services/CameraService';
import { EvilIcons } from '@expo/vector-icons';

export default function PlaceDetail() {
    const { place } = useRoute().params || {};
    // console.log('PlaceDetail:', place);
    const [placeDetails, setPlaceDetails] = useState(place || {});
    const [showCamera, setShowCamera] = useState(false);

    // Toggle the camera screen visibility
    const toggleCamera = () => {
        setShowCamera(!showCamera);
    };

    // Update the place details when the place is changed
    useEffect(() => {
        if (place) {
            setPlaceDetails(place);
        }
    }, [place]);

    // Open the Google Map app
    const openMapsApp = () => {
        if (!placeDetails.geometry || !placeDetails.geometry.location) {
            console.error('Location data is missing');
            return;
        }

        const { lat, lng } = placeDetails.geometry.location;
        const address = placeDetails.formatted_address ? encodeURIComponent(placeDetails.name) : `${lat},${lng}`;

        const iosGoogleMapsUrl = `comgooglemaps://?q=${address}&center=${lat},${lng}&zoom=14`;
        const androidUrl = `geo:${lat},${lng}?q=${address}`;
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;

        const url = Platform.select({
            ios: iosGoogleMapsUrl,
            android: androidUrl,
        }) || webUrl;

        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Linking.openURL(webUrl);
                }
            })
            .catch(err => console.error('An error occurred', err));
    };

    return (
        <ScrollView style={styles.container}>
            <PlaceDetailItem place={placeDetails} onDirectionClick={openMapsApp} />
            <GoogleMapView placeList={[placeDetails]} />
            <TouchableOpacity
                style={styles.cameraButton}
                onPress={toggleCamera}>
                <EvilIcons
                    name="camera"
                    size={80}
                    color={showCamera ? "#e32f45" : "#748c94"}
                /><Text style={styles.cameraButtonText}>Take Photo For This Place</Text>
            </TouchableOpacity>
            <Modal
                visible={showCamera}
                animationType="slide"
                transparent={true}
            >
                <CameraScreen
                    showCamera={showCamera}
                    onCancel={() => setShowCamera(false)}
                    type={'gallery'}
                    onImageCaptured={(imageUri) => {
                        CameraService.handleImageCaptured(imageUri, 'gallery', placeDetails.name);
                        setShowCamera(false);
                    }}
                    placeDetails={placeDetails}
                />
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.WHITE,
        flex: 1
    },
    button: {
        marginTop: 20,
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
    cameraButton: {
        alignSelf: 'center',
        padding: 10,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 30,
        alignItems: 'center',
    },
    cameraButtonText: {
        color: Colors.BORDER_GOLD,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 30,
    },

});
