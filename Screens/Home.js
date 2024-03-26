import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import UserLocation from '../Shared/UserLocation'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <UserLocation />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_YELLOW,
  }
})