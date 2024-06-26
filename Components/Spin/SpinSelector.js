import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDownList from '../../Shared/DropDownList';
import { getUpdatedUserSpin } from '../../Shared/updateUserSpin'

export default function SpinSelector({ spinSelectHandler }) {
  const { spins } = getUpdatedUserSpin();
  const [selectedSpin, setSelectedSpin] = useState('')
  const [itemId, setItemId] = useState([])
  const [spinNames, setSpinNames] = useState([])

  // Set the spin names when the spins are updated
  useEffect(() => {
    if (spins) {
      setSpinNames(spins.map(spin => [spin.id, spin.spinName]))
    }
  }, [spins])

  // Log the spin names when they are updated
  useEffect(() => {
    console.log("SpinSelector.js spinNames: ", spinNames)
  }, [spinNames])

  // Handle the item select and update the selected spin
  const handleItemSelect = (items) => {
    console.log("SpinSelector.js handleItemSelect items: ", items)
    setSelectedSpin(items.label)
    setItemId(items.value)
    spinSelectHandler(items)
  }

  return (
    <View style={styles.container}>
      <DropDownList
        placeholder={spins ? spins[0].spinName : ""}
        listItems={spinNames}
        handleItemSelect={handleItemSelect}
        selectedSpin={selectedSpin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
  },

})