import PlaceMarker from './PlaceMarker';
import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { getUserData } from './FirestoreService';

export default function GoogleMapView({ placeList }) {
    const [mapRegion, setMapRegion] = useState({});

    useEffect(() => {
        const fetchUserDataAndSetRegion = async () => {
            try {
                // Replace 'userDocId' with the actual user document ID
                const userDocId = 'user_document_id_here'; // Provide the user document ID
                const userData = await getUserData(userDocId); // Fetch user data
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

        fetchUserDataAndSetRegion();

    }, []);    

    return (
        <View s tyle={{marginTop:10}}>
            <View style={{borderRadius:20, overflow:'hidden'}}>
                <MapView style={{
                    width:Dimensions.get('screen').width*0.9,
                    height:Dimensions.get('screen').height*0.25,
                    borderRadius:20
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                region={mapRegion}
                >
                    {/* {mapRegion.latitude && mapRegion.longitude && (
                        <Marker 
                            title='You'
                            coordinate={mapRegion}/>
                    )} */}
                    {/* <Marker 
                        title='You'
                        coordinate={mapRegion}/> */}
                    {/* {placeList && placeList.length > 0 && placeList.slice(0,6).map((item, index) => {
                            // Check if item has an id for key, if not use index
                            const key = item.id ? item.id.toString() : `place_${index}`;
                            return <PlaceMarker key={key} item={item} />;
                        })} */}
                </MapView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({});