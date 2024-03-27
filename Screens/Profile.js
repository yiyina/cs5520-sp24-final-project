import { StyleSheet, Pressable, View, Alert, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../Shared/Colors'
import { FontAwesome } from '@expo/vector-icons';
import CameraScreen from './CameraScreen';
import { auth } from '../firebase-files/FirebaseSetup';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import CameraService from '../Services/CameraService';
import EditProfile from './EditProfile';
import Avatar from '../Shared/Avatar';

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser || null);
  const [showCamera, setShowCamera] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
        setAvatarUri(null);
      }
    });

    return () => {
      subscriber();
    };
  }, []);

  const fetchUserData = async (uid) => {
    try {
      if (uid) {
        const userDocRef = await FirestoreService.getUserData(uid);
        if (userDocRef && userDocRef.avatar) {
          setAvatarUri({ uri: userDocRef.avatar });
        }
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
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

  const toggleEditProfile = () => {
    setShowProfile(!showProfile);
  }
 const handleDeleteAvatar = () => {
    Alert.alert(
        "Delete Avatar", // Alert Title
        "Are you sure you want to delete your avatar?", // Alert Message
        [
            {
                text: "Cancel",
                onPress: () => console.log("Avatar deletion canceled"), // Optionally handle the cancel action
                style: "cancel"
            },
            { 
                text: "OK", 
                onPress: async () => {
                    try {
                       
                        if (user && user.uid) {
                          
                            await FirestoreService.deleteAvatarFromStorage(user.uid);
                   

                           
                            setAvatarUri(null);

                            console.log("Avatar successfully deleted.");
                        }
                    } catch (error) {
                        console.error("Error deleting avatar: ", error);
                    }
                }
            }
        ],
        { cancelable: false } 
    );
};
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoutProfile}>
          <Pressable onPress={handleLogout} style={styles.logout}>
            <SimpleLineIcons name="logout" size={24} color={Colors.DEEP_RED} />
            <Text style={styles.text}>Logout</Text>
          </Pressable>
          <Pressable onPress={toggleEditProfile} style={styles.logout}>
            <Text style={styles.text}>Profile</Text>
            <AntDesign name="profile" size={24} color={Colors.DEEP_RED} />
          </Pressable>
        </View>
        
        <View style={styles.avatarContainer}>
          <Avatar avatarUri={avatarUri} size={100} />
          {avatarUri && (
            <Pressable onPress={handleDeleteAvatar} style={styles.deleteButton}>
              <AntDesign name="delete" size={24} color="red" />
          </Pressable>
        )}
        </View>
        <Pressable onPress={toggleCamera} style={styles.editAvatar}>
          <FontAwesome name="camera-retro" size={24} color="white" style={{ padding: 10 }} />
          {/* <Text style={styles.text}>Edit</Text> */}
        </Pressable>
        <CameraScreen
          showCamera={showCamera}
          onCancel={toggleCamera}
          onImageCaptured={(imageUri) => CameraService.handleImageCaptured(imageUri, setAvatarUri)}
          type={'avatar'} />
      </View>
      <View style={styles.body}>
      </View>
      <EditProfile
        showProfile={showProfile}
        onCancel={toggleEditProfile} />
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
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.DEEP_RED,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 5,
  },
})