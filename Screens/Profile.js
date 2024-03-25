import { StyleSheet, Pressable, View, Image, Modal, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../Shared/Colors'
import { FontAwesome } from '@expo/vector-icons';
import CameraScreen from './CameraScreen';
import { auth } from '../firebase-files/FirebaseSetup';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { MaterialIcons } from '@expo/vector-icons';

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser || null);
  const [showCamera, setShowCamera] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    console.log("currentUser id: ", auth.currentUser.uid);
    console.log("currentUser photo: ", auth.currentUser.photoURL);
    const subscriber = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(auth.currentUser.uid);
      } else {
        setUser(null);
        setAvatarUri(null);
      }
    });

    const fetchUserData = async (uid) => {
      try {
        const userDocId = await FirestoreService.getUserDocId(uid);
        if (userDocId) {
          const userDocRef = await FirestoreService.getUserData(userDocId);
          if (userDocRef && userDocRef.avatar) {
            setAvatarUri({ uri: userDocRef.avatar });
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    return () => {
      subscriber();
    };
  }, []);

  const handleImageCaptured = async (imageUri) => {
    try {
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={avatarUri}
            defaultSource={require('../assets/default_avatar.png')}
            style={styles.avatar}
          />
        </View>
        <Pressable onPress={toggleCamera}>
          <FontAwesome name="camera-retro" size={24} color="white" style={{ padding: 10 }} />
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
        <Pressable onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="white" />
        </Pressable>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
})