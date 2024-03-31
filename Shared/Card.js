import { StyleSheet, View, Dimensions } from 'react-native'
import React from 'react'
import Colors from './Colors'

export default function LoginForm({ children }) {

    return (
        <View intensity={10} tint="dark" style={styles.container}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: '10%',
        borderRadius: 20,
        width: Dimensions.get('window').width*0.8,
        backgroundColor: Colors.WHITE,
        opacity: 0.9,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    }
})