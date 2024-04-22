import { StyleSheet, View, Dimensions } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import Header from '../Components/Home/Header'
import Histogram from '../Components/Home/Histogram'
import NavToSpin from '../Components/Home/NavToSpin'

const screenHeight = Dimensions.get('window').height;
const topOffset = screenHeight < 700 ? '65%' : '75%';

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
    height: topOffset,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: Colors.MAIN_BACKGROUND,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      height: -1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
})