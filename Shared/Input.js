import { StyleSheet, View, TextInput, Dimensions } from 'react-native'
import React from 'react'

export default function Input({ text, handleInput, secureTextEntry }) {

  const textChange = (text) => {
    handleInput(text)
  }

  return (
    <View style={styles.container}>
      <TextInput 
        value={text}
        onChangeText={textChange}
        secureTextEntry={secureTextEntry}></TextInput>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        height: 30,
        borderRadius: 10,
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 60,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
    }
})