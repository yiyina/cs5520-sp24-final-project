import { StyleSheet, Pressable, View, Dimensions } from 'react-native'
import React from 'react'
import { EvilIcons } from '@expo/vector-icons';
import Colors from '../../Shared/Colors'

export default function Footer() {
    const editHandler = () => {
        console.log('Edit button clicked')
    }
    
    return (
        <Pressable style={styles.container} onPress={editHandler}>
            <EvilIcons name="pencil" size={60} color={Colors.WHITE} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        right: Dimensions.get('window').width * 0.1,
        bottom: Dimensions.get('window').height * 0.2,
        position: 'absolute',
        borderRadius: 50,
        height: 60,
        width: 60,
        backgroundColor: Colors.BLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },
})