import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import Colors from '../../Shared/Colors'
import Avatar from '../../Shared/Avatar'
import { AntDesign } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'

export default function EditAvatar({ avatarUri, handleDeleteAvatar, toggleCamera}) {
    return (
        <View style={styles.avatarContainer}>
            <Avatar avatarUri={avatarUri} size={100} />
            {avatarUri && avatarUri.uri && (
                <Pressable onPress={handleDeleteAvatar} style={styles.deleteButton}>
                    <AntDesign name="delete" size={24} color="red" />
                </Pressable>
            )}
            <Pressable onPress={toggleCamera} style={styles.editAvatar}>
                <FontAwesome name="camera-retro" size={24} color="black" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarContainer: {
        borderWidth: 5,
        borderColor: Colors.WHITE,
        borderRadius: 100,
        marginBottom: 50,
    },
    editAvatar: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 5,
    },
    deleteButton: {
        position: 'absolute',
        bottom: -10,
        left: -10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 5,
    },
})