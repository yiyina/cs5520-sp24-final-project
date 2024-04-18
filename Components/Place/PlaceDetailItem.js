import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '../../Shared/Colors'
import { MY_API_KEY } from '@env'
import Share from '../../Services/Share'

export default function PlaceDetailItem({ place, onDirectionClick }) {
    if (!place || Object.keys(place).length === 0) {
        return null; 
    }
    console.log("PlaceDetailItem", place);

    return (
        <View>
            <Text style={{ fontSize: 26 }}>
                {place.name}
            </Text>
            <View style={styles.ratingContainer}>
                <AntDesign name="star" size={20} color={Colors.YELLOW} />
                <Text>{place.rating}</Text>
            </View>

            {place?.photos && place.photos.length > 0 ? (
                <Image
                    source={{
                        uri: 
                        "https://maps.googleapis.com/maps/api/place/photo?" + 
                        "maxwidth=400" + 
                        "&photo_reference=" + 
                        place.photos[0].photo_reference + 
                        "&key=" + MY_API_KEY
                    }}
                    style={styles.placeImage}
                />
            ) : null}

            <Text style={styles.vicinityText} numberOfLines={2}>
                {place.vicinity? place.vicinity : place.formatted_address}
            </Text>
            {place?.opening_hours && (
                <Text style={
                    place.opening_hours.open_now ? 
                    { color: Colors.BLUE, fontSize: 16 } : 
                    { color: Colors.LIGHT_RED, fontSize: 16 }
                }>
                    {place.opening_hours.open_now ? "(Open)" : "(Closed)"}
                </Text>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.directionShareButton} onPress={()=>onDirectionClick()}>
                    <Ionicons name="navigate-circle-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>Direction</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.directionShareButton} onPress={()=>Share.SharePlace(place)}>
                    <AntDesign name="sharealt" size={24} color="black" />
                    <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    placeImage: {
        width: "100%",
        height: 160,
        borderRadius: 15,
        marginTop: 10,
    },
    vicinityText: {
        fontSize: 16,
        marginTop: 10,
        color: Colors.DARK_GRAY,
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    directionShareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.GRAY,
        padding: 3,
        borderRadius: 40,
        justifyContent: 'center',
        width: '48%', 
    },
    buttonText: {
        fontSize: 14,
        marginLeft: 5,
    },
});