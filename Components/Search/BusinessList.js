import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import BusinessItem from './BusinessItem'

export default function BusinessList({ placeList }) {

    return (
        <View>
            <FlatList
                data={placeList}
                horizontal={true}
                renderItem={({ item, index }) => index < 10 && (
                    <TouchableOpacity
                        // onPress={() => navigation.navigate(
                        //     'place-detail', { place: item }
                        // )}
                    >
                        <BusinessItem place={item} />
                    </TouchableOpacity>
                )} />
        </View>
    )
}

const styles = StyleSheet.create({})