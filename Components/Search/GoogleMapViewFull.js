import { StyleSheet, Dimensions, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { getUpdatedUserSpin } from '../../Shared/updateUserSpin';

export default function GoogleMapViewFull() {
    const [mapRegion, setMapRegion] = useState({});
    const { coords } = getUpdatedUserSpin();

    useEffect(() => {
        if (coords) {
            setMapRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    }, [coords]);

    return (
        <View>
            <MapView 
                style={styles.mapView}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                region={mapRegion}>

            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    mapView: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.91,
    }
})