=import { StyleSheet, Pressable, View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import Colors from '../Shared/Colors'
import { auth } from '../firebase-files/FirebaseSetup';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import EditProfile from './EditProfile';
import Avatar from '../Shared/Avatar';
import { getUpdatedUserData } from '../Shared/updateUserData';
import NotificationManager from '../Services/NotificationManager';
import UserGallery from '../Components/UserGallery';


export default function Profile() {
  const { avatarUri } = getUpdatedUserData();
  const [showProfile, setShowProfile] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [notificationSettings, setNotificationSettings] = useState({ lunchEnabled: false, dinnerEnabled: false });
  const uid = auth.currentUser ? auth.currentUser.uid : null;

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Logout Cancelled"),
        style: "cancel"
      },
      {
        text: "Logout", 
        onPress: async () => {
          try {
            await auth.signOut();
          } catch (error) {
            console.error("Error signing out: ", error);
          }
        },
        style: "destructive"
      }
    ]);
  };

  const toggleEditProfile = () => {
    console.log("Edit Profile Pressed: ", showProfile);
    setShowProfile(!showProfile);
  }

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
        </View>
         <Pressable onPress={() => setIsModalVisible(!isModalVisible)} style={styles.notificationContainer}>
          <Text style={styles.text}>Schedule a Notification</Text>
          <AntDesign name="notification" size={24} color={Colors.DEEP_RED} />
        </Pressable>
        {isModalVisible && (
        <View style={styles.notificationsettingContainer}>
            <NotificationManager
              onCancel={() => setIsModalVisible(false)}
              settings={notificationSettings}
              onSave={setNotificationSettings} 
            />
          <Pressable onPress={() => setIsModalVisible(false)} style={styles.dismissButton}>
          <Text style={styles.text}>Save Notification Setting.</Text>
        </Pressable>
          </View>
          )}
      </View>
      <View style={styles.body}>
      
        <View style={styles.UserGallerycontainer}>
          <Text style={styles.userGalleryTitle}>User Gallery</Text>
          <UserGallery />
        </View>
        
        
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
    backgroundColor: Colors.LIGHT_YELLOW,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  header: {
    position: 'absolute',
    zIndex: 1,
    top: 50,
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
    backgroundColor: Colors.WHITE, 
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
  body: {
    flex: 1,
    marginTop: 150,
    marginBottom: 50,
    borderWidth: 5,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.LIGHT_RED,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    position: 'absolute'
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
  notificationsettingContainer: {
  position: 'absolute', // Overlay on the screen
  width: '95%', // Width of the container
  backgroundColor: Colors.LIGHT_YELLOW, // Background color
  padding: 20, // Padding around the content
  borderRadius: 10, // Rounded corners
  alignItems: 'center', // Center items horizontally
  justifyContent: 'center', // Center items vertically
  top: 210,
  height: 200,
  
  },
 UserGallerycontainer: {
    flex: 1,
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 30, // Adjust the marginTop to increase or decrease the distance
    padding: 10,
    zIndex: 0,
  },
   userGalleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    color: Colors.LIGHT_YELLOW, 
  },
    
    notificationContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 }, 
    borderColor: Colors.WHITE,
    borderWidth: 2,
    marginTop: 10,
  },

})