import React, { useState, useEffect } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import Colors from '../Shared/Colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationManager = ({ settings, onSave }) => {
  const [lunchEnabled, setLunchEnabled] = useState(settings.lunchEnabled);
  const [dinnerEnabled, setDinnerEnabled] = useState(settings.dinnerEnabled);
useEffect(() => {
  // This effect is for updating parent component's state
  onSave({ lunchEnabled, dinnerEnabled });
}, [lunchEnabled, dinnerEnabled, onSave]);

useEffect(() => {
  // This effect is for registering for push notifications
  const registerNotifications = async () => {
    await registerForPushNotificationsAsync();
  };

  registerNotifications();
}, []); // Empty dependency array means this runs once on mount

useEffect(() => {
  // This effect handles notification scheduling
  const manageNotifications = async () => {
    // Cancel all previous notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    if (lunchEnabled) {
      await scheduleNotification('It\'s lunch time! Let\'s Play Game!', 'Enjoy your meal!', 12, 0);
    }
    
    if (dinnerEnabled) {
      await scheduleNotification('Dinner time! Let\'s Play Game!', 'Bon appétit!', 18, 0);
    }
  };

  manageNotifications();
}, [lunchEnabled, dinnerEnabled]); // This depends on lunchEnabled and dinnerEnabled


  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get permission for notifications!');
      return;
    }
    console.log('Notification permission granted.',finalStatus);
  }
  
  async function scheduleNotification(title, body, hour, minute) {
    const schedulingOptions = {
      content: {
        title,
        body,
      },
      trigger: {
        hour: Number(hour), 
        minute: Number(minute), 
        repeats: true,
      },
    };
    await Notifications.scheduleNotificationAsync(schedulingOptions);
  }

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.Text }>Schedule Lunch Notification at 12pm</Text>
        <Switch
          value={lunchEnabled}
          onValueChange={setLunchEnabled}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.Text }>Schedule Dinner Notification at 6pm</Text>
        <Switch
          value={dinnerEnabled}
          onValueChange={setDinnerEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
    marginLeft: 10,
  },
  Text: {
    marginTop: 3,
    color: Colors.DEEP_RED,
    fontSize: 15,
    marginRight: 10,
  

  },
});

export default NotificationManager;
