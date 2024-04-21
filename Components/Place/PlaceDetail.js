import { Platform, StyleSheet, ScrollView,TouchableOpacity,Text} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute,useNavigation } from '@react-navigation/native';
import PlaceDetailItem from './PlaceDetailItem';
import Colors from '../../Shared/Colors';
import GoogleMapView from './GoogleMapView';
import { Linking } from 'react-native';

export default function PlaceDetail() {
    const navigation = useNavigation();
    const { place } = useRoute().params || {};
    console.log('PlaceDetail:', place);
    const [placeDetails, setPlaceDetails] = useState(place || {});

    useEffect(() => {
        if (place) {
            setPlaceDetails(place);
        }
    }, [place]);
     const handleSelectLocation = () => {
         navigation.navigate('Gallery', { selectedPlace: placeDetails });
    };

    const openMapsApp = () => {
        if (!placeDetails.geometry || !placeDetails.geometry.location) {
            console.error('Location data is missing');
            return;
        }

        const { lat, lng } = placeDetails.geometry.location;
        const label = encodeURIComponent(placeDetails.name || 'Location');
        const query = encodeURIComponent(placeDetails.formatted_address || `${lat},${lng}`);

        const iosUrl = `maps:${lat},${lng}?q=${query}`;
        const googleMapsUrl = `comgooglemaps://?q=${label}&center=${lat},${lng}&zoom=14`;
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        const url = Platform.select({
            ios: googleMapsUrl,
            android: `geo:${lat},${lng}?q=${query}`
        });

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
            <TouchableOpacity style={styles.button} onPress={handleSelectLocation}>
                <Text style={styles.buttonText}>Select This Location Showed In Gallery</Text>
            </TouchableOpacity>

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
