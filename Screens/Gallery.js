import { StyleSheet, Pressable, View, Text } from 'react-native'
import React, { useState } from 'react'
import Colors from '../Shared/Colors'
import { AntDesign } from '@expo/vector-icons';
import Avatar from '../Shared/Avatar';
import { getUpdatedUserData } from '../Shared/updateUserData';
import NotificationManager from '../Services/NotificationManager';
import UserGallery from '../Components/UserGallery';


export default function Gallery() {
  const { avatarUri } = getUpdatedUserData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({ lunchEnabled: false, dinnerEnabled: false });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoutProfile}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    backgroundColor: Colors.MAIN_BACKGROUND,
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
    borderColor: Colors.BORDER_GOLD,
    borderRadius: 100,
    backgroundColor: Colors.MAIN_BACKGROUND,
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
    borderColor: Colors.BORDER_GOLD,
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
  notificationsettingContainer: {
    position: 'absolute',
    width: '95%',
    backgroundColor: Colors.LIGHT_YELLOW,
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 210,
    height: 200,

  },
  UserGallerycontainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
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