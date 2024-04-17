import { StyleSheet, Text, View, Alert, Pressable } from 'react-native'
import React from 'react'
import { auth } from '../../firebase-files/FirebaseSetup';
import { SimpleLineIcons } from '@expo/vector-icons';
import Colors from '../../Shared/Colors';

export default function Logout() {
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

    return (
        <View style={styles.container}>
            <Pressable onPress={handleLogout} style={styles.logout}>
                <SimpleLineIcons name="logout" size={36} color={Colors.DEEP_RED} />
                <Text style={styles.text}>Logout</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
      color: Colors.DEEP_RED,
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 5,
    },
})