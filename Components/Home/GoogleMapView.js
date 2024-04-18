// import PlaceMarker from './PlaceMarker';
import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import FirestoreService from '../../firebase-files/FirebaseHelpers';
import Colors from '../../Shared/Colors';
import { getLocation } from '../../Shared/LocationManager';
import PlaceMarker from '../Place/PlaceMarker';

export default function GoogleMapView({ placeList }) {
    console.log('GoogleMapView placeList:', placeList);
    const [mapRegion, setMapRegion] = useState({});

    useEffect(() => {
        const fetchUserDataAndSetRegion = async () => {
            try {
                // Replace 'userDocId' with the actual user document ID
                const userData = await FirestoreService.getUserData(); // Fetch user data
                console.log('userData:', userData);
                if (userData && userData.coords) {
                    setMapRegion({
                        latitude: userData.coords.latitude,
                        longitude: userData.coords.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getLocation().then(() => {
            fetchUserDataAndSetRegion();
        })
    }, []);

    return (
        <View style={styles.container}>
                <MapView style={styles.mapView}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    region={mapRegion}
                >
                    {mapRegion.latitude && mapRegion.longitude && (
                        <Marker 
                            title='You'
                            coordinate={mapRegion}/>
                    )}
                    {placeList && placeList.length > 0 && placeList.slice(0,6).map((item, index) => {
                            // Check if item has an id for key, if not use index
                            const key = item.id ? item.id.toString() : `place_${index}`;
                            return <PlaceMarker key={key} item={item} />;
                        })}
                </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    mapView: {
        width: Dimensions.get('screen').width*0.9,
        height: Dimensions.get('screen').height * 0.25,
        borderRadius: 20,
        borderWidth: 5,
        borderColor: Colors.BORDER_GOLD,
    }
});