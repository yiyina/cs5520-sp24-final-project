import { StyleSheet, Dimensions, View } from 'react-native'
import React, { useState } from 'react'
import DropDownList from '../../Shared/DropDownList';

export default function SpinSelector({  }) {
  const [selectedSpin, setSelectedSpin] = useState("FOOD")

  return (
    <View style={styles.container}>
      <DropDownList placeholder={selectedSpin} listItems={selectedSpin} handleItemSelect={setSelectedSpin} selectedSpin={selectedSpin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },

})