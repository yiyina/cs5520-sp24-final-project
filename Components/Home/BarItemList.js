import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../Shared/Colors'
import { MY_API_KEY } from '@env'
import { getUpdatedUserData } from '../../Shared/updateUserData'
import { getDistance } from '../../Shared/CalculateDistance'

export default function BarItemList({ place }) {
    const { coords } = getUpdatedUserData();

    return (
        <View style={styles.container}>
            {place?.photos && place.photos.length > 0 ? (
                <Image source={{
                    uri:
                        "https://maps.googleapis.com/maps/api/place/photo?" +
                        "maxwidth=400" +
                        "&photo_reference=" +
                        place?.photos[0]?.photo_reference +
                        "&key=" + MY_API_KEY
                }}
                    style={{
                        width: 110,
                        height: 110,
                        borderRadius: 15,
                    }} />
            ) : (
                <Image source={require('../../assets/placeholder.jpg')}
                    style={{
                        width: 110,
                        height: 110,
                        borderRadius: 15,
                    }} />
            )}
            <View style={{ flex: 1 }}>
                <Text
                    numberOfLines={1}
                    style={{ fontSize: 20, marginBottom: 5, fontWeight: "bold" }}>{place.name}</Text>
                <Text numberOfLines={2} style={styles.title} >
                    {place.vicinity ? place.vicinity : place.formatted_address}</Text>
                <Text numberOfLines={1}>
                    {place.opening_hours?.open_now ? 'Open' : 'Closed'}
                    {coords && place.geometry ? ` (${getDistance(coords.latitude, coords.longitude, place.geometry.location.lat, place.geometry.location.lng).toFixed(2)} miles)` : ''}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                    <AntDesign name="star" size={20} color={Colors.DARK_RED} />
                    <Text>{place.rating}</Text>
                    <Text>({place.user_ratings_total})</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: Colors.MAIN_BACKGROUND,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.TEXT_COLOR,
        gap: 10,
        alignItems: 'center',
    }
})