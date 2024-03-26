import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Marker } from 'react-native-maps'

export default function PlaceMarker({ item }) {
  if (
    !item ||
    !item.geometry ||
    !item.geometry.location ||
    typeof item.geometry.location.lat !== 'number' ||
    typeof item.geometry.location.lng !== 'number'
  ) {
    console.error('Invalid item:', item);
    // Optionally, you could return null or a default marker here
    return null;
  }
  
  return (
    <View>
      <Marker 
        title={item.name}
        coordinate={
            {
                latitude: item.geometry.location.lat,
                longitude: item.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        } />
    </View>
  )
}

const styles = StyleSheet.create({});