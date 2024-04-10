import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SearchBar from '../Components/Search/SearchBar'
import GoogleMapViewFull from '../Components/Search/GoogleMapViewFull'

export default function Search() {
  return (
    <View>
      <View style={{ position: 'absolute', zIndex: 10 }}>
        <SearchBar />
      </View>
      <GoogleMapViewFull />
    </View>
  )
}

const styles = StyleSheet.create({})