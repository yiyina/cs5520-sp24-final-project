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

    const imageSource = avatarUri && avatarUri.uri
        ? { uri: avatarUri.uri }
        : require('../assets/default_avatar.png');


    return (
        <Image
            source={imageSource}
            style={styles.avatar}
        />
    )
}