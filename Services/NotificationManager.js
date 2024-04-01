import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Button, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function NotificationManager() {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isLunchScheduled, setIsLunchScheduled] = useState(false);
  const [isDinnerScheduled, setIsDinnerScheduled] = useState(false);
  const [lunchNotificationId, setLunchNotificationId] = useState(null);
  const [dinnerNotificationId, setDinnerNotificationId] = useState(null);

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const { granted } = await Notifications.getPermissionsAsync();
    setIsPermissionGranted(granted);
    if (!granted) {
        Alert.alert("Permissions required", "You need to enable notifications permissions in your settings.");
    }
  };
    

  const handleScheduleNotification = async (type) => {
  let time = new Date();
  let title;
  let body;
  
  if (type === 'lunch') {
    time.setHours(12, 0, 0);
    title = "Lunch Time";
    body = "It's time for lunch!";
  } else if (type === 'dinner') {
    time.setHours(18, 0, 0); // Set to 6 PM instead of 17:41 for dinner
    title = "Dinner Time";
    body = "It's time for dinner!";
  }

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: 0,
        repeats: true
      },
    });

    if (type === 'lunch') {
      setIsLunchScheduled(true);
      setLunchNotificationId(identifier);
    } else if (type === 'dinner') {
      setIsDinnerScheduled(true);
      setDinnerNotificationId(identifier);
    }
  } catch (error) {
    console.error("Error scheduling notification: ", error);
    Alert.alert("Error", "Failed to schedule notification. Please try again.");
  }
};


  const handleCancelNotification = async (type) => {
    if (type === 'lunch' && lunchNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(lunchNotificationId);
      setIsLunchScheduled(false);
      setLunchNotificationId(null);
    } else if (type === 'dinner' && dinnerNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(dinnerNotificationId);
      setIsDinnerScheduled(false);
      setDinnerNotificationId(null);
    }
  };

  const requestPermissions = async () => {
    const { granted } = await Notifications.requestPermissionsAsync({
      ios: { allowBadge: true, allowSound: true, allowAlert: true },
    });
    setIsPermissionGranted(granted);
    if (!granted) {
      Alert.alert("Permission denied", "You cannot schedule notifications without permissions.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Manager</Text>
      {isPermissionGranted ? (
        <>
          <View style={styles.settingContainer}>
            <Text>Schedule Lunch Notification at 12pm</Text>
            <Switch
              value={isLunchScheduled}
              onValueChange={newValue => {
                if (newValue) {
                  handleScheduleNotification('lunch');
                } else {
                  handleCancelNotification('lunch');
                }
              }}
            />
          </View>
          <View style={styles.settingContainer}>
            <Text>Schedule Dinner Notification at 6pm</Text>
            <Switch
              value={isDinnerScheduled}
              onValueChange={newValue => {
                if (newValue) {
                  handleScheduleNotification('dinner');
                } else {
                  handleCancelNotification('dinner');
                }
              }}
            />
          </View>
          <Button title="Request Permissions" onPress={requestPermissions} />
        </>
      ) : (
        <View style={styles.centeredView}>
          <Text style={styles.warningText}>Notifications permission is not granted.</Text>
          <Button title="Request Permission" onPress={requestPermissions} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  warningText: {
    color: 'red',
  },
  centeredView: {
    alignItems: 'center',
  },

});
