import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import Colors from '../Shared/Colors';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationManager = ({ onSave }) => {
  const [settings, setSettings] = useState({ lunchEnabled: false, dinnerEnabled: false });

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    manageNotifications();
    saveSettings();
  }, [settings]);

  const loadSettings = async () => {
    const storedSettings = await AsyncStorage.getItem('notificationSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  };

  const saveSettings = async () => {
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
  };

  const manageNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (settings.lunchEnabled) {
      await scheduleNotification('It\'s lunch time! Let\'s Play Game!', 'Enjoy your meal!', 12, 0);
    }
    if (settings.dinnerEnabled) {
      await scheduleNotification('Dinner time! Let\'s Play Game!', 'Bon appétit!', 18, 0);
    }
  };

  const scheduleNotification = async (title, body, hour, minute) => {
    const schedulingOptions = {
      content: {
        title,
        body,
      },
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true,
      },
    };
    await Notifications.scheduleNotificationAsync(schedulingOptions);
  };

  return (
    <View style={styles.container}>
      <SwitchContainer
        label="Schedule Lunch Notification at 12pm"
        enabled={settings.lunchEnabled}
        onChange={value => setSettings(prev => ({ ...prev, lunchEnabled: value }))}
      />
      <SwitchContainer
        label="Schedule Dinner Notification at 6pm"
        enabled={settings.dinnerEnabled}
        onChange={value => setSettings(prev => ({ ...prev, dinnerEnabled: value }))}
      />
    </View>
  );
};

const SwitchContainer = ({ label, enabled, onChange }) => (
  <View style={styles.switchContainer}>
    <Text style={styles.text}>{label}</Text>
    <Switch value={enabled} onValueChange={onChange} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: Colors.DARK_COLOR,
  },
});

export default NotificationManager;