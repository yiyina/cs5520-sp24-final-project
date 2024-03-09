import { StyleSheet, Pressable, View, Image, Modal, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../Shared/Colors'
import { FontAwesome } from '@expo/vector-icons';
import CameraScreen from './CameraScreen';
import { auth } from '../firebase-files/FirebaseSetup';
import FirestoreService from '../firebase-files/FirebaseHelpers';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        console.log("currentUser id: ", currentUser.uid);
        console.log("currentUser photo: ", currentUser.photoURL);

        const userDocId = await FirestoreService.getUserDocId(currentUser.uid);
        if (userDocId) {
          console.log("userDocId: ", userDocId);
          const userDocRef = await FirestoreService.getUserData(userDocId);
          console.log("userDocRef: ", userDocRef);
          if (userDocRef && userDocRef.avatar) {
            setAvatarUri({ uri: userDocRef.avatar });
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const subscriber = auth.onAuthStateChanged(fetchUserData);
    return subscriber; // unsubscribe on unmount
  }, []);

  const handleImageCaptured = async (imageUri) => {
    try {
      console.log("Profile imageUri: ", imageUri);
      const userDocId = await FirestoreService.getUserDocId(user.uid);
      if (userDocId) {
        setAvatarUri({ uri: imageUri });
      } else {
        console.error("No user document found for UID:", uid);
      }
    } catch (error) {
      console.error("Error updating user avatar: ", error);
    }
  };

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={avatarUri ? avatarUri : require('../assets/default_avatar.png')}
            style={styles.avatar}
          />
        </View>
        <Pressable onPress={toggleCamera}>
          <FontAwesome name="camera-retro" size={24} color="white" style={{padding: 10}}/>
        </Pressable>
        <Modal
          visible={showCamera}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleCamera}
        >
          <CameraScreen onCancel={toggleCamera} onImageCaptured={handleImageCaptured} type={'avatar'} />
        </Modal>
      </View>
      <View style={styles.body}>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    backgroundColor: Colors.LIGHT_YELLOW,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  header: {
    position: 'absolute',
    zIndex: 1,
    marginTop: 100,
    alignItems: 'center',
  },
  avatarContainer: {
    borderWidth: 5,
    borderColor: Colors.WHITE,
    borderRadius: 100,
  },
  avatar: {
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
  body: {
    flex: 1,
    width: '100%',
    marginTop: 150,
    marginBottom: 50,
    borderWidth: 5,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.LIGHT_RED,
    borderRadius: 50,
  },
})