import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import GoogleMapView from '../Components/Home/GoogleMapView'
import Header from '../Components/Home/Header'
import { LinearGradient } from 'expo-linear-gradient'

export default function Home() {
  return (
    <View style={styles.container}>
      {/* <LinearGradient
        colors={[Colors.LIGHT_YELLOW, Colors.GRAY]}
        style={styles.gradient}
      > */}
        <Header />
        <GoogleMapView />
      {/* </LinearGradient> */}
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