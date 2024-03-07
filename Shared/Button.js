import { StyleSheet, Text, Pressable } from 'react-native'
import React from 'react'

export default function Button({ text, textColor }) {

    const styles = StyleSheet.create({
        container: {
            margin: 10,
            padding: 10,
        },  
        text: {
            color: textColor,
        }
    })

    return (
        <Pressable style={styles.container} onPress={() => console.log("button pressed")}>
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    )
}

