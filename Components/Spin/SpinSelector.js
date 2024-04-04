import { StyleSheet, Dimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDownList from '../../Shared/DropDownList';
import { getUpdatedUserSpin } from '../../Shared/updateUserSpin'

export default function SpinSelector({ spinSelectHandler }) {
  const { spins } = getUpdatedUserSpin();
  console.log("SpinSelector spins: ", spins)
  const [selectedSpin, setSelectedSpin] = useState('')
  const [itemId, setItemId] = useState([])
  const [spinNames, setSpinNames] = useState([])

  useEffect(() => {
    if (spins) {
      setSpinNames(spins.map(spin => [spin.id, spin.spinName]))
    }
  }, [spins])

  useEffect(() => {
    console.log("SpinSelector spinNames: ", spinNames)
  }, [spinNames])

  const handleItemSelect = (items) => {
    console.log("handleItemSelect items: ", items)
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