import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import SpinWheel from '../Animation/SpinWheel'
import Header from '../Components/Spin/Header'
import Footer from '../Components/Spin/Footer'
import ColorThemes from '../Components/Spin/DefaultColorSet'
import { defaultSpin } from '../Components/Spin/DefaultSpin'
import FirestoreService from '../firebase-files/FirebaseHelpers'

export default function Spin() {
  const [selectedSpin, setSelectedSpin] = useState('')
  const [spinItems, setSpinItems] = useState([])
  const [spinColor, setSpinColor] = useState([])


  const originalSpin = {
    spinColor: ColorThemes.SPRINGFLOWER,
    spinItems: defaultSpin,
    spinName: 'FOOD',
  }

  useEffect(() => {
    async function fetchData() {
      const spinsCollection = await FirestoreService.getSpinsCollection();
      if (spinsCollection.length === 0) {
        await FirestoreService.addSpinToUser(originalSpin)
      }
      const userSpin = await FirestoreService.getSpinsCollection();
      setSpinItems(userSpin[0].spinItems)
      setSpinColor(userSpin[0].spinColor)
    }
    fetchData()
  }, [])

  const spinSelectHandler = async (spin) => {
    const spins = await FirestoreService.getSpinsCollection();
    console.log("Spin spins: ", spin, spins)

    const selectedSpin = spins.find(s => s.id === spin[0].value)
    console.log("Spin selectedSpin: ", selectedSpin)
    setSpinItems(selectedSpin.spinItems)
    setSpinColor(selectedSpin.spinColor)
  }

  return (
    <View style={styles.container}>
      <Header spinSelectHandler={spinSelectHandler} />
      <SpinWheel spinItems={spinItems} spinColor={spinColor} />
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})