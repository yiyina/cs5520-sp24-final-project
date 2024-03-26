import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import GoogleMapView from '../Components/Home/GoogleMapView'
import Header from '../Components/Home/Header'

export default function Home() {
  return (
    <View style={styles.container}>
      <Header />
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