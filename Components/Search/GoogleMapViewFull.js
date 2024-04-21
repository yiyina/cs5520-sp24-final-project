import { StyleSheet, Dimensions, View, Pressable, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import PlaceMarker from '../Place/PlaceMarker';
import { FontAwesome6 } from '@expo/vector-icons';
import { getLocation } from '../../Shared/LocationManager';
import { getUpdatedUserData } from '../../Shared/updateUserData';
import Colors from '../../Shared/Colors';

export default function GoogleMapViewFull({ placeList }) {
    const { coords, avatarUri } = getUpdatedUserData();
    const [mapRegion, setMapRegion] = useState({});
    const [mapRef, setMapRef] = useState(null);


    useEffect(() => {
        console.log('GoogleMapViewFull.js coords: ', coords);
    }, [coords])

    useEffect(() => {
        const fetchUserDataAndSetRegion = async () => {
            try {
                if (coords) {
                    setMapRegion({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.0522,
                        longitudeDelta: 0.0321,
                    });
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

    const customUserMarker = () => (
        <View style={styles.avatarContainer}>
            <Image
                source={avatarUri}
                style={styles.avatarImage}
            />
        </View>
    );

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
                {mapRegion.latitude && mapRegion.longitude && avatarUri && (
                    <Marker
                        title='You'
                        coordinate={mapRegion}
                    >
                        {customUserMarker()}
                    </Marker>
                )}
            </MapView>
            <Pressable
                style={({ pressed }) => [
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
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        zIndex: 10,
        top: 200,
        right: 20,
        borderRadius: 50,
        elevation: 3,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderRadius: 50,
        borderColor: Colors.DARK_COLOR,
        width: 50, 
        height: 50, 
    },
    avatarImage: {
        width: 40, 
        height: 40, 
        borderRadius: 50,
    },
})