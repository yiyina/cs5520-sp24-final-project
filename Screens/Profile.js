import { StyleSheet, Pressable, View, Image, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../Shared/Colors'
import { FontAwesome } from '@expo/vector-icons';
import CameraScreen from './CameraScreen';
import { auth } from '../firebase-files/FirebaseSetup';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import CameraService from '../Services/CameraService';

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
        <View style={styles.logoutProfile}>
          <Pressable onPress={handleLogout} style={styles.logout}>
            <SimpleLineIcons name="logout" size={24} color="darkred" />
            <Text style={styles.text}>Logout</Text>
          </Pressable>
          <Pressable onPress={handleLogout} style={styles.logout}>
            <Text style={styles.text}>Profile</Text>
            <AntDesign name="profile" size={24} color="darkred" />
          </Pressable>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={avatarUri}
            defaultSource={require('../assets/default_avatar.png')}
            style={styles.avatar}
          />
        </View>
        <Pressable onPress={toggleCamera} style={styles.editAvatar}>
          <FontAwesome name="camera-retro" size={24} color="white" style={{ padding: 10 }} />
          <Text style={styles.text}>Edit</Text>
        </Pressable>
        <CameraScreen
          showCamera={showCamera}
          onCancel={toggleCamera}
          onImageCaptured={(imageUri) => CameraService.handleImageCaptured(imageUri, setAvatarUri)}
          type={'avatar'} />
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
    marginTop: 50,
    alignItems: 'center',
    width: '100%',
  },
  logoutProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
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
  editAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
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
  text: {
    color: 'darkred',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})