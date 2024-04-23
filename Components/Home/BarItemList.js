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
                    style={styles.placeName}>{place.name}</Text>
                <Text numberOfLines={2} style={styles.title} >
                    {place.vicinity ? place.vicinity : place.formatted_address}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {place?.opening_hours && <Text numberOfLines={1}
                        style={
                            place.opening_hours?.open_now ?
                                { color: Colors.BLUE, fontSize: 16 } :
                                { color: Colors.LIGHT_RED, fontSize: 16 }
                        }>
                        {place.opening_hours.open_now ? "Open" : "Closed"}
                    </Text>}
                    <Text numberOfLines={1}>
                        {coords && place.geometry ? ` (${getDistance(coords.latitude, coords.longitude, place.geometry.location.lat, place.geometry.location.lng).toFixed(2)} miles)` : ''}</Text>
                </View>
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
        marginHorizontal: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        gap: 10,
        alignItems: 'center',
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    placeName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.TEXT_COLOR,
        marginBottom: 5,
    },
})