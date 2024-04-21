import { StyleSheet, View } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import Header from '../Components/Home/Header'
import Histogram from '../Components/Home/Histogram'
import NavToSpin from '../Components/Home/NavToSpin'

export default function Home() {
  return (
    <View style={styles.container}>
        <Header />
        <NavToSpin />
        <Histogram />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND,
  },
})