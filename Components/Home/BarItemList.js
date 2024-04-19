import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../Shared/Colors'
import { MY_API_KEY } from '@env'

export default function BarItemList({ place }) {
    return (
        <View style={styles.container}>
{/* https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=ATplDJbed0RnZcVUdcs_yUTUUSZA8a11BLuj3ck7yMbGRX-orrr2XBRgqRlXjrLuTZysH7rJ0ZRlL3WTlB1yI0EO_rGuEb7Ocdq4QIjGPOxUzT8CD5uIiZ_RUaAMr9xIiuCoeichsmcO5lDE6XvCBZbwH5cQxCaKdyZ7N1X6vBQdw_YlJqgc&key=${MY_API_KEY} */}
            {place?.photos && place.photos.length > 0 ? ( 
                <Image source={{uri: 
                    "https://maps.googleapis.com/maps/api/place/photo?" + 
                    "maxwidth=400" + 
                    "&photo_reference=" + 
                    place?.photos[0]?.photo_reference + 
                    "&key=" + MY_API_KEY        
                }} 
                style={{
                    width:110, 
                    height:110,
                    borderRadius: 15,        
                }}/>
            ) : (
                <Image source={require('../../assets/placeholder.jpg')} 
                style={{
                    width:110, 
                    height:110,
                    borderRadius: 15,        
                }}/>
            )}
            <View style={{flex:1}}>
                <Text
                    numberOfLines={2} 
                    style={{fontSize:18, marginBottom: 5}}>{place.name}</Text>
                <Text 
                    numberOfLines={2} 
                    style={{fontSize:18, marginBottom: 5}}>{place.vicinity}</Text>
                <View style={{display:'flex', flexDirection:'row', gap: 5, alignItems:'center'}}>
                    <AntDesign name="star" size={20} color={Colors.YELLOW} />
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
        margin: 10,
        backgroundColor: Colors.MAIN_BACKGROUND,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.TEXT_COLOR,
        width: Dimensions.get('window').width * 0.9,
        gap: 10,
        alignItems: 'center',
    }
})