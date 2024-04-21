import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import Colors from '../Shared/Colors'
import UserGallery from '../Components/UserGallery';
import CameraScreen from './CameraScreen';
import CameraService from '../Services/CameraService';
import { EvilIcons } from '@expo/vector-icons';

export default function Gallery(props) {
  const [showCamera, setShowCamera] = useState(false);

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userGalleryTitle}>User Gallery</Text>
        {/* <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={toggleCamera}>
            <EvilIcons 
              name="camera" 
              size={45} 
              color={showCamera ? "#e32f45" : "#748c94"} 
            />
        </TouchableOpacity>
        <Modal
          visible={showCamera}
          animationType="slide"
          transparent={true}
        >
          <CameraScreen
            showCamera={showCamera}
            onCancel={() => setShowCamera(false)}
            type={'gallery'}
            onImageCaptured={(imageUri) => {
              CameraService.handleImageCaptured(imageUri, 'gallery');
              setShowCamera(false);
            }}
          />
        </Modal> */}
      </View>
      <View style={styles.body}>
        <UserGallery />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row', // Change to row to align items horizontally
    justifyContent: 'space-between', // Align items to start and end
    alignItems: 'center',
    width: '100%',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  userGalleryTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.TEXT_COLOR,
  },
  cameraButton: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_YELLOW,

  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    width: '100%',
    marginTop: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
