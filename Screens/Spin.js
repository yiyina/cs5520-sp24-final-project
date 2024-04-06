import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import SpinWheel from '../Animation/SpinWheel'
import Header from '../Components/Spin/Header'
import EditSpin from '../Components/Spin/EditSpin'
import ColorThemes from '../Components/Spin/DefaultColorSet'
import { defaultSpin } from '../Components/Spin/DefaultSpin'
import FirestoreService from '../firebase-files/FirebaseHelpers'
import AddEditSpin from '../Components/Spin/AddEditSpin'

export default function Spin() {
  const [spinItems, setSpinItems] = useState([])
  const [spinColor, setSpinColor] = useState([])
  const [spinColorName, setSpinColorName] = useState('')
  const [spinId, setSpinId] = useState('')

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
      setSpinId(spinsCollection[0].id)
      setSpinItems(spinsCollection[0].spinItems)
      setSpinColor(spinsCollection[0].spinColor)
      setSpinColorName(Object.keys(ColorThemes).find(key => JSON.stringify(ColorThemes[key]) === JSON.stringify(spinsCollection[0].spinColor)))
    }
    fetchData()
  }, [])

  const spinSelectHandler = async (spinId) => {
    const spins = await FirestoreService.getSpinsCollection();
    const selectedSpin = spins.find(s => s.id === spinId)
    console.log("Spin selectedSpin: ", selectedSpin)
    setSpinId(selectedSpin.id)
    setSpinItems(selectedSpin.spinItems)
    setSpinColor(selectedSpin.spinColor)
    setSpinColorName(Object.keys(ColorThemes).find(key => JSON.stringify(ColorThemes[key]) === JSON.stringify(selectedSpin.spinColor)))
  }

  return (
    <View style={styles.container}>
      <Header spinSelectHandler={spinSelectHandler} />
      <SpinWheel spinItems={spinItems} spinColor={spinColor} />
      <EditSpin spinId={spinId} spinColorName={spinColorName} />
      {/* <AddEditSpin spinId={spinId} spinColorName={spinColorName} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})