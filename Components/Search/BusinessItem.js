import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { MY_API_KEY } from '@env'
import Colors from '../../Shared/Colors'
import { AntDesign } from '@expo/vector-icons'

export default function BusinessItem({ place }) {
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
            <Text numberOfLines={2} style={styles.title} >
                {place.vicinity ? place.vicinity : place.formatted_address}</Text>
            <View style={styles.rating}>
                <AntDesign name="star" size={20} color={Colors.LIGHT_RED} />
                <Text>{place.rating}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 240,
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