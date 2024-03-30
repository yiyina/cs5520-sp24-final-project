import { StyleSheet, Text, Pressable } from 'react-native'
import React, { useState } from 'react'

export default function Button({ text, textColor, buttonPress, containerStyle, textStyle, defaultStyle, pressedStyle }) {
    // const [isPressed, setIsPressed] = useState(false);

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
        <Pressable
            style={({ pressed }) => pressed ? [styles.container, pressedStyle] : [styles.container, defaultStyle]} 
            onPress={buttonClick}>
            <Text style={textStyle? [textStyle, styles.text] : styles.text}>{text}</Text>
        </Pressable>
    )
}

