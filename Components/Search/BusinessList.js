import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import BusinessItem from './BusinessItem'
import { useNavigation } from '@react-navigation/native'

export default function BusinessList({ placeList }) {
    const navigation = useNavigation();

    return (
        <View>
            <FlatList
                data={placeList}
                horizontal={true}
                renderItem={({ item, index }) => index < 10 && (
                    <TouchableOpacity
                        onPress={() => {
                            console.log('BusinessList item:', item)
                            navigation.navigate('place-detail', { place: item })
                        }}
                    >
                        <BusinessItem place={item} />
                    </TouchableOpacity>
                )} />
        </View>
    )
}

const styles = StyleSheet.create({})