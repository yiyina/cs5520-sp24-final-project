import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../Shared/Colors'
import { AntDesign } from '@expo/vector-icons';
import NotificationManager from '../../Services/NotificationManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@notificationSettings';

export default function Notification() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({ lunchEnabled: false, dinnerEnabled: false });

    // Load the notification settings when the component mounts
    useEffect(() => {
        loadSettings();
    }, []);

    // Load the notification settings from AsyncStorage
    const loadSettings = async () => {
        try {
            const settings = await AsyncStorage.getItem(SETTINGS_KEY);
            if (settings !== null) {
                setNotificationSettings(JSON.parse(settings));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    // Save the notification settings to AsyncStorage
    const saveSettings = async (settings) => {
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            setNotificationSettings(settings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <>
            <Pressable 
                onPress={() => setIsModalVisible(!isModalVisible)} 
                style={({pressed}) => [
                    styles.notificationContainer,
                    { backgroundColor: pressed ? Colors.LIGHT_COLOR : Colors.WHITE }
                ]}>
                <Text style={styles.text}>Schedule your Daily Notification</Text>
                <AntDesign name="notification" size={24} color={Colors.TEXT_COLOR} />
            </Pressable>
            {isModalVisible && (
                <View style={styles.notificationsettingContainer}>
                    <NotificationManager
                        onCancel={() => setIsModalVisible(false)}
                        settings={notificationSettings}
                        onSave={saveSettings}
                    />
                    {/* <Pressable 
                        onPress={() => {
                            saveSettings(notificationSettings);
                            setIsModalVisible(false);
                        }} 
                        style={({ pressed }) => [
                            styles.dismissButton,
                            { backgroundColor: pressed ? Colors.TEXT_COLOR : Colors.WHITE }
                        ]}>
                        <Text style={styles.text}>Save Notification Setting</Text>
                    </Pressable> */}
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    notificationContainer: {
        marginBottom: 10,
        padding: 5,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    notificationsettingContainer: {
        position: 'absolute',
        zIndex: 10,
        width: Dimensions.get('window').width * 0.9,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').height * 0.15,
        top: 250,
    },
    text: {
        color: Colors.TEXT_COLOR,
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 5,
    },
    // dismissButton: {
    //     padding: 10,
    //     borderRadius: 10,
    //     marginTop: 10,
    // },
})