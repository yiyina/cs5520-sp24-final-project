import React, { useState, useEffect } from 'react';
import { View, Switch, Text, StyleSheet, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import Colors from '../Shared/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const STORAGE_KEY = '@notificationTime';

const NotificationManager = ({ settings, onSave }) => {
  const [lunchEnabled, setLunchEnabled] = useState(settings.lunchEnabled);
  const [dinnerEnabled, setDinnerEnabled] = useState(settings.dinnerEnabled);
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    // Load saved time from AsyncStorage
    const loadTimeFromStorage = async () => {
      try {
        const savedTime = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTime !== null) {
          setTime(new Date(savedTime));
        }
      } catch (error) {
        console.error('Error loading time from AsyncStorage:', error);
      }
    };

    loadTimeFromStorage();
  }, []);

  useEffect(() => {
    // Save time to AsyncStorage whenever it changes
    const saveTimeToStorage = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, time.toISOString());
      } catch (error) {
        console.error('Error saving time to AsyncStorage:', error);
      }
    };

    saveTimeToStorage();
  }, [time]);

  useEffect(() => {
    // This effect is for updating parent component's state
    onSave({ lunchEnabled, dinnerEnabled, time });
  }, [lunchEnabled, dinnerEnabled, time, onSave]);

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
        const hour = time.getHours();
        const minute = time.getMinutes();
        await scheduleNotification('Let\'s Play Game!', 'Enjoy your Spin Time!', hour, minute);
      }

      if (dinnerEnabled) {
        await scheduleNotification('Dinner time! Let\'s Play Game!', 'Bon appétit!', 18, 0);
      }
    };

    manageNotifications();
  }, [lunchEnabled, dinnerEnabled, time]); // This depends on lunchEnabled and dinnerEnabled

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
    console.log('Notification permission granted.', finalStatus);
  }

  async function scheduleNotification(title, body, hour, minute) {
    console.log('scheduling notification', title, body, hour, minute);
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
      {/* <Text style={styles.Text}>Schedule Notification at</Text> */}
      <View style={styles.switchContainer}>
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            if (event.type === 'set') {
              setTime(selectedTime);
            }
          }}
        />
        <Switch
          value={lunchEnabled}
          onValueChange={setLunchEnabled}
        />
      </View>
      {/* <View style={styles.switchContainer}>
        <Text style={styles.Text}>Schedule Dinner Notification at</Text>
        <Switch
          value={dinnerEnabled}
          onValueChange={setDinnerEnabled}
        />
      </View> */}
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
    alignItems: 'center',
    width: '100%',  
    backgroundColor: Colors.WHITE, 
    paddingVertical: 15,
    paddingHorizontal: 20, 
    borderRadius: 10, 
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
    marginBottom: 20,
  },
  Text: {
    color: Colors.BORDER_GOLD, 
    fontSize: 20,
    fontWeight: 'bold', 
  },
});

export default NotificationManager;