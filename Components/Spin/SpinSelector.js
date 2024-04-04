import { StyleSheet, Dimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDownList from '../../Shared/DropDownList';
import FirestoreService from '../../firebase-files/FirebaseHelpers';

export default function SpinSelector({ spinSelectHandler }) {
  const [selectedSpin, setSelectedSpin] = useState('')
  const [spins, setSpins] = useState([])
  const [itemId, setItemId] = useState([])

  useEffect(() => {
    async function fetchData() {
      const spinsCollection = await FirestoreService.getSpinsCollection();
      const userSpins = spinsCollection.map(spin => [spin.id, spin.spinName])
      setSpins(userSpins)
      setSelectedSpin(userSpins[0][1])
    }
    fetchData()
  }, [])

  const handleItemSelect = (items) => {
    setSelectedSpin(items.label)
    setItemId(items.value)
    spinSelectHandler(items)
  }

  return (
    <View style={styles.container}>
      <DropDownList placeholder={selectedSpin} listItems={spins} handleItemSelect={handleItemSelect} selectedSpin={selectedSpin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
  },

})