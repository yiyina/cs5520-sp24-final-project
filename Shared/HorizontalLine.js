import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from './Colors'

export default function HorizontalLine() {
    return (
        <View style={styles.container}>
            <Text style={styles.line}></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        width: '100%',
        height: 0,
    },
    line: {
        borderBottomWidth: 2,
        width: '100%',
        backgroundColor: Colors.BLACK,
    },
})