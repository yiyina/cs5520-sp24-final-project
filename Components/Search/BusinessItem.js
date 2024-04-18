import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { MY_API_KEY } from '@env'
import Colors from '../../Shared/Colors'
import { AntDesign } from '@expo/vector-icons'
import { getUpdatedUserData } from '../../Shared/updateUserData'

export default function BusinessItem({ place }) {
    const { coords } = getUpdatedUserData();

    const ensureTwoLines = (text) => {
        return text.includes('\n') ? text : text + '\n ';
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d * 0.621371; // Distance in miles
    }

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
            <Text>
                {place.opening_hours?.open_now ? 'Open' : 'Closed'}
                {coords && place.geometry ? ` (${getDistance(coords.latitude, coords.longitude, place.geometry.location.lat, place.geometry.location.lng).toFixed(2)} miles)` : ''}</Text>
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
        height: 250,
        backgroundColor: Colors.WHITE,
        padding: 10,
        borderRadius: 15,
        marginHorizontal: 10,
        marginBottom: 25,
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
        marginTop: 5,
    },
    rating: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },
})