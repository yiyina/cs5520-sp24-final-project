import { StyleSheet, View, Dimensions } from 'react-native'
import React from 'react'
import SpinSelector from './SpinSelector'
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.container}>
      <Feather name="settings" size={24} color="black" />
      <SpinSelector />
      <AntDesign name="pluscircleo" size={24} color="black" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.1,
    marginTop: Dimensions.get('window').height * 0.1,
    borderWidth: 1,
  },
})