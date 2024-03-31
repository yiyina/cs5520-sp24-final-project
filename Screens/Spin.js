import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SpinWheel from '../Animation/SpinWheel'

export default function Spin() {
  return (
    <View style={styles.container}>
      <SpinWheel />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})