import { StyleSheet, Text, Pressable } from 'react-native'
import React from 'react'

export default function Button({ text, textColor, buttonPress, containerStyle, textStyle }) {

    const buttonClick = () => {
        buttonPress()
    }

    const styles = StyleSheet.create({
        container: {
            margin: 10,
            padding: 10,
            alignItems: 'center',
        },  
        text: {
            color: textColor,
        }
    })

    return (
        <Pressable style={containerStyle ? [containerStyle, styles.container] : styles.container} onPress={buttonClick}>
            <Text style={textStyle? [textStyle, styles.text] : styles.text}>{text}</Text>
        </Pressable>
    )
}

