import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet, Alert, Platform, Text, Dimensions } from 'react-native';
import * as Notifications from 'expo-notifications';
import Colors from '../Shared/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../Shared/Button';

// This is the NotificationManager component that schedules notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// This is the key for storing notification time in AsyncStorage
const STORAGE_KEY = '@notificationTime';

const NotificationManager = ({ settings, onSave }) => {
  const [lunchEnabled, setLunchEnabled] = useState(settings.lunchEnabled);
  const [time, setTime] = useState(new Date());
  const [isPickerShow, setIsPickerShow] = useState(false);

  // Load saved time from AsyncStorage when the component mounts
  useEffect(() => {
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

  // Register for push notifications when the component mounts
  useEffect(() => {
    const registerNotifications = async () => {
      await registerForPushNotificationsAsync();
    };
    registerNotifications();
  }, []);

  // Request permission for notifications
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

  // Schedule a notification at a specific time
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

  // Function to handle Save button click
  async function handleSave() {
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, time.toISOString());
      Alert.alert('Notification time saved!');
    } catch (error) {
      console.error('Error saving time to AsyncStorage:', error);
    }

    // Schedule notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (lunchEnabled) {
      const hour = time.getHours();
      const minute = time.getMinutes();
      await scheduleNotification('Let\'s Play Game!', 'Enjoy your Spin Time!', hour, minute);
    }

    // Update parent component's state
    onSave({ lunchEnabled, time });
  }

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        {Platform.OS !== 'ios' && (
          <Text style={{ fontWeight: 'bold' }}>
            Set time at:  {`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
          </Text>
        )}
        {Platform.OS === 'ios' || isPickerShow ? ( 
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === 'ios' ? 'default' : 'spinner'}
            onChange={(event, selectedTime) => {
              const isSet = event.type === 'set';
              if (Platform.OS !== 'ios' && isSet) {
                setIsPickerShow(false);
              }
              if (isSet) {
                setTime(selectedTime || time); 
                setLunchEnabled(true); 
              }
            }}
          />
        ) : null}
        <Switch
          value={lunchEnabled}
          onValueChange={(newValue) => {
            setLunchEnabled(newValue);
            setIsPickerShow(newValue);
          }}
        />
        <Button
          text="Save"
          textStyle={{ fontSize: 16 }}
          defaultStyle={[styles.saveButtonStyle, { backgroundColor: Colors.LIGHT_COLOR }]}
          pressedStyle={[styles.saveButtonStyle, { backgroundColor: Colors.DARK_COLOR }]}
          buttonPress={handleSave}
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
    width: Dimensions.get('window').width * 0.8,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
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
  saveButtonStyle: {
    position: 'absolute',
    right: 0,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default NotificationManager;
