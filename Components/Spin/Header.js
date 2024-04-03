import { StyleSheet, View, Dimensions, Pressable } from 'react-native'
import React from 'react'
import SpinSelector from './SpinSelector'
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../Shared/Colors';
import AddSpin from './AddSpin';

export default function Header() {
  const [showAddSpinModal, setShowAddSpinModal] = React.useState(false)

  const handleAddSpinModal = () => {
    setShowAddSpinModal(true)
  }

  const onCancel = () => {
    setShowAddSpinModal(false)
  }

  return (
    <View style={styles.container}>
      <Feather name="settings" size={24} color={Colors.BLUE} />
      <SpinSelector />
      <Pressable onPress={handleAddSpinModal}>
        <AntDesign name="pluscircleo" size={24} color={Colors.BLUE} />
      </Pressable>
      <AddSpin showAddSpinModal={showAddSpinModal} onCancel={onCancel} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    flexDirection: 'row',
    top: Dimensions.get('window').height * 0.1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
  },
})