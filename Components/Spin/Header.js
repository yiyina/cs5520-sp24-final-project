import { StyleSheet, View, Dimensions, Pressable } from 'react-native'
import React from 'react'
import SpinSelector from './SpinSelector'
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../Shared/Colors';
import AddSpin from './AddSpin';

export default function Header({ spinSelectHandler }) {
  const [showAddSpinModal, setShowAddSpinModal] = React.useState(false)

  const handleAddSpinModal = () => {
    setShowAddSpinModal(true)
  }

  return (
    <View style={styles.container}>
      <SpinSelector spinSelectHandler={spinSelectHandler} />
      <Pressable
        onPress={handleAddSpinModal}
        style={({ pressed }) => [
          styles.addButton,
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <AntDesign
          name="pluscircleo"
          size={36}
          color={Colors.BORDER_GOLD}
          style={{ opacity: 1 }}
          activeStyle={{ opacity: 0.5 }}
        />
      </Pressable>
        <AddSpin showAddSpinModal={showAddSpinModal} setShowAddSpinModal={setShowAddSpinModal} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    flexDirection: 'row',
    top: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  addSpinText: {
    color: Colors.BORDER_GOLD,
    fontSize: 20,
    fontWeight: 'bold',
  },
})