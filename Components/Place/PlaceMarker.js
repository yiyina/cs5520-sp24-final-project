import { StyleSheet, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Marker } from 'react-native-maps'
import { MY_API_KEY } from '@env'

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

  const photoUrl = item?.photos && item.photos.length > 0
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${item.photos[0].photo_reference}&key=${MY_API_KEY}`
    : undefined;

  useEffect(() => {
    console.log('PlaceMarker photoUrl:', photoUrl);
  }, [photoUrl]);

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
        } >
        {photoUrl && (
          <Image
            source={{ uri: photoUrl }}
            style={styles.image}
          />
        )}
      </Marker>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 50,  
    height: 50, 
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
})