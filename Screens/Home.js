import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
// import GoogleMapView from '../Components/Home/GoogleMapView'
import Header from '../Components/Home/Header'
import Histogram from '../Shared/Histogram'
import NavToSpin from '../Components/Home/NavToSpin'

export default function Home() {
  return (
    <View style={styles.container}>
        <Header />
        {/* <GoogleMapView /> */}
        <NavToSpin />
        <Histogram />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.MAIN_BACKGROUND,
  },
  gradient: {
    padding: 20,
    borderRadius: 10,
  },
})