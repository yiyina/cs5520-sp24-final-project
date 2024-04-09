import { StyleSheet, Pressable, View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import Colors from '../Shared/Colors'
import { auth } from '../firebase-files/FirebaseSetup';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import EditProfile from './EditProfile';
import Avatar from '../Shared/Avatar';
import { getUpdatedUserData } from '../Shared/updateUserData';
import NotificationManager from '../Services/NotificationManager';
import PhotoGallery from '../Components/PhotoGallery';


export default function Profile() {
  const { avatarUri } = getUpdatedUserData();
  const [showProfile, setShowProfile] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [notificationSettings, setNotificationSettings] = useState({ lunchEnabled: false, dinnerEnabled: false });

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
         <Pressable onPress={() => setIsModalVisible(!isModalVisible)} style={styles.logout}>
            <Text style={styles.text}>Schedule a Notification</Text>
        </Pressable>
        {isModalVisible && (
        <View style={styles.notificationContainer}>
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
        <PhotoGallery />
        
        
        
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
  notificationContainer: {
  position: 'absolute', // Overlay on the screen
  width: '90%', // Width of the container
  maxHeight: '80%', // Max height to allow scrolling within
  backgroundColor: Colors.LIGHT_YELLOW, // Background color
  padding: 20, // Padding around the content
  borderRadius: 10, // Rounded corners
  alignItems: 'center', // Center items horizontally
  justifyContent: 'center', // Center items vertically
    marginTop: 180,
  
},

})