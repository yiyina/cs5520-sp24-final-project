import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import GoogleMapView from '../Components/Home/GoogleMapView'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      {/* <UserLocation /> */}
      <GoogleMapView />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_YELLOW,
  }
})