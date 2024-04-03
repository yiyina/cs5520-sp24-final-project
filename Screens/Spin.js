import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import SpinWheel from '../Animation/SpinWheel'
import Header from '../Components/Spin/Header'
import Footer from '../Components/Spin/Footer'
import { springFlowerColors } from '../Components/Spin/DefaultColorSet'
import { defaultSpin } from '../Components/Spin/DefaultSpin'
import { auth } from '../firebase-files/FirebaseSetup'
import FirestoreService from '../firebase-files/FirebaseHelpers'

export default function Spin() {

  const originalSpin = {
    spinName: 'FOOD',
    spinItems: defaultSpin,
    spinColor: springFlowerColors
  }

  useEffect(() => {
    async function fetchData() {
      const spinsCollection = await FirestoreService.getSpinsCollection();
      if (spinsCollection.length === 0) {
        await FirestoreService.addSpinToUser(originalSpin)
      }
    }
    fetchData()
  }, [])

  return (
    <View style={styles.container}>
      <Header/>
      <SpinWheel />
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})