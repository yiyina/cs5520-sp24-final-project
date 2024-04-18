import { StyleSheet, Dimensions, View, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import PlaceMarker from '../Place/PlaceMarker';
import FirestoreService from '../../firebase-files/FirebaseHelpers';
import { FontAwesome6 } from '@expo/vector-icons';
import { getLocation } from '../../Shared/LocationManager';

export default function GoogleMapViewFull({ placeList }) {
    const [mapRegion, setMapRegion] = useState({});
    const [mapRef, setMapRef] = useState(null);
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        const fetchUserDataAndSetRegion = async () => {
            try {
                const userData = await FirestoreService.getUserData(); // Fetch user data
                console.log('userData:', userData);
                if (userData && userData.coords) {
                    setMapRegion({
                        latitude: userData.coords.latitude,
                        longitude: userData.coords.longitude,
                        latitudeDelta: 0.0522,
                        longitudeDelta: 0.0321,
                    });
                } else {
                    const userCoords = await FirestoreService.getUserData();
                    setCoords(userCoords.coords);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        getLocation().then(() => {
            fetchUserDataAndSetRegion();
        })
    }, [coords]);

    const handleMyLocationPress = () => {
        if (mapRef && coords) {
            mapRef.animateToRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0522,
                longitudeDelta: 0.0421,
            }, 1000);
        }
    };

    return (
        <View>
            <MapView
                ref={(ref) => { setMapRef(ref); }}
                style={styles.mapView}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={false}
                region={mapRegion}>
                {placeList && placeList.length > 0 && placeList.slice(0, 6).map((item, index) => {
                    // Check if item has an id for key, if not use index
                    const key = item.id ? item.id.toString() : `place_${index}`;
                    return <PlaceMarker key={key} item={item} />;
                })}
            </MapView>
            <Pressable 
                style={({pressed}) => [
                    styles.myLocationButton,
                    {
                        backgroundColor: pressed ? 'lightgray' : 'white',
                    },
                ]} onPress={handleMyLocationPress}>
                <FontAwesome6 name="location-crosshairs" size={24} color="gray" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    mapView: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.91,
    },
    myLocationButton: {
        position: 'absolute',
        height: 60,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        zIndex: 10,
        top: 200,
        right: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 50,
        elevation: 3,
    },
})