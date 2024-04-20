import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../Shared/Colors'
import { AntDesign } from '@expo/vector-icons';
import NotificationManager from '../../Services/NotificationManager';

export default function Notification() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({ lunchEnabled: false, dinnerEnabled: false });

    return (
        <>
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
        </>
    )
}

const styles = StyleSheet.create({
    notificationContainer: {
        paddingBottom: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        borderColor: Colors.WHITE,
        borderWidth: 2,
    },
    notificationsettingContainer: {
        position: 'absolute',
        zIndex: 10,
        width: '95%',
        backgroundColor: Colors.LIGHT_COLOR,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        top: 250,
    },
    text: {
        color: Colors.DEEP_RED,
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 5,
    },
})