import { StyleSheet, View } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import Header from '../Components/Home/Header'
import Histogram from '../Components/Home/Histogram'
import NavToSpin from '../Components/Home/NavToSpin'

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
        <NavToSpin />
      </View>
      <View style={styles.histogramContainer}>
        <Histogram />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND,
  },
  headerContainer: {
    height: '100%',
    backgroundColor: Colors.WHITE,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  histogramContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: Colors.MAIN_BACKGROUND,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      height: -2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 10,
  },
})