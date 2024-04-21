import { Platform, StyleSheet, ScrollView,TouchableOpacity,Modal} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute,useNavigation } from '@react-navigation/native';
import PlaceDetailItem from './PlaceDetailItem';
import Colors from '../../Shared/Colors';
import GoogleMapView from './GoogleMapView';
import { Linking } from 'react-native';
import CameraScreen from '../../Screens/CameraScreen';
import CameraService from '../../Services/CameraService';
import { EvilIcons } from '@expo/vector-icons';

export default function PlaceDetail() {
    const navigation = useNavigation();
    const { place } = useRoute().params || {};
    // console.log('PlaceDetail:', place);
    const [placeDetails, setPlaceDetails] = useState(place || {});
      const [showCamera, setShowCamera] = useState(false);

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };

    useEffect(() => {
        if (place) {
            setPlaceDetails(place);
        }
    }, [place]);


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
              size={45} 
              color={showCamera ? "#e32f45" : "#748c94"} 
            />
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
                navigation.navigate('Gallery');
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
});
