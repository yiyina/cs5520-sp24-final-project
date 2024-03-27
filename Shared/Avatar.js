import { StyleSheet, Image } from 'react-native'
import React from 'react'

export default function Profile({ avatarUri, size }) {
    const styles = StyleSheet.create({
        avatar: {
            width: size,
            height: size,
            borderRadius: size,
        }
    })

    return (
        <Image
            source={avatarUri.uri ? avatarUri : require('../assets/default_avatar.png')}
            style={styles.avatar}
        />
    )
}