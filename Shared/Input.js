import { StyleSheet, View, TextInput } from 'react-native'
import React from 'react'

export default function Input({ text, handleInput, secureTextEntry, onSubmitEditing }) {

  const textChange = (text) => {
    handleInput(text)
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={textChange}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onSubmitEditing}
        returnKeyType='done'
      >
      </TextInput>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
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