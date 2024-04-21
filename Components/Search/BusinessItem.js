import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { MY_API_KEY } from '@env'
import Colors from '../../Shared/Colors'
import { AntDesign } from '@expo/vector-icons'
import { getUpdatedUserData } from '../../Shared/updateUserData'
import { getDistance } from '../../Shared/CalculateDistance'

export default function BusinessItem({ place }) {
    const { coords } = getUpdatedUserData();

    const ensureTwoLines = (text) => {
        return text.includes('\n') ? text : text + '\n ';
    };

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
                    style={styles.image} />
            ) : (
                <Image source={require('../../assets/placeholder.jpg')}
                    style={styles.placeholderImg} />
            )}
            <Text numberOfLines={2} style={styles.name} >
                {ensureTwoLines(place.name)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {place?.opening_hours &&
                    <Text numberOfLines={1}
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
            <Text numberOfLines={2} style={styles.title} >
                {place.vicinity ? place.vicinity : place.formatted_address}</Text>
            <View style={styles.rating}>
                <AntDesign name="star" size={20} color={Colors.LIGHT_RED} />
                <Text style={{ paddingHorizontal: 5 }}>{place.rating}</Text>
                <Text>({place.user_ratings_total})</Text></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 260,
        backgroundColor: Colors.WHITE,
        padding: 10,
        borderRadius: 15,
        marginHorizontal: 10,
        marginBottom: 50,
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    image: {
        width: 140,
        height: 110,
        borderRadius: 15,
    },
    placeholderImg: {
        width: 140,
        height: 110,
        borderRadius: 15,
    },
    title: {
        fontSize: 13,
        color: Colors.DARK_GRAY,
        marginTop: 5
    },
    name: {
        fontSize: 16,
        marginVertical: 5,
        fontWeight: 'bold',
    },
    rating: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },
})