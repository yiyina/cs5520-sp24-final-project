import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcom}>Welcome To</Text>
      <Image 
        source={require('../assets/SpinLogo.png')} 
        style={styles.logo}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100, 
        alignItems: 'center',
    },
    welcom: {
        fontSize: 60,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
    },
    logo: {
        width: 300,
        height: 100,
    }
})