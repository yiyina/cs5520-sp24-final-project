import { StyleSheet, Pressable, View, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import Colors from '../Shared/Colors'
import { FontAwesome } from '@expo/vector-icons';
import CameraScreen from './CameraScreen';

export default function Profile() {
  const [showCamera, setShowCamera] = useState(false)

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/default_avatar.png')}
            style={styles.logo}
          />
        </View>
        <Pressable onPress={toggleCamera}>
          <FontAwesome name="camera-retro" size={24} color="black" />
        </Pressable>
        <Modal
          visible={showCamera}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleCamera}
        >
          <CameraScreen onCancel={toggleCamera} />
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    marginTopo: 50,
  },
  avatarContainer: {
    borderWidth: 5,
    borderColor: Colors.WHITE,
    borderRadius: 100,
    padding: 2,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    opacity: 1,
  },
})