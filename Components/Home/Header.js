import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, firestore } from '../../firebase-files/FirebaseSetup'
import { onSnapshot, collection, query, where } from "firebase/firestore";
import Colors from '../../Shared/Colors'
import Avatar from '../../Shared/Avatar'

const getGreetingBasedOnTime = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 12) {
        return 'Good Morning';
    } else if (hours < 18) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
}

export default function Header() {
    const [user, setUser] = useState(auth.currentUser || null);
    const [username, setUsername] = useState(null);
    const [avatarUri, setAvatarUri] = useState(null);
    const greeting = getGreetingBasedOnTime();

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(firestore, "users"),
                where("uid", "==", auth.currentUser.uid)
            ),
            (querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("Cannot find user data in firestore.");
                    return;
                }
                setAvatarUri({ uri: querySnapshot.docs[0].data().avatar });
                setUsername(querySnapshot.docs[0].data().username);
            },
            (error) => {
                console.error(error.message);
            }
        );
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar avatarUri={avatarUri} size={50} />
            </View>
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>{username || 'Guest'}, {greeting} !</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 50,
        width: '90%',
        alignItems: 'center',
    },
    avatarContainer: {
        borderWidth: 5,
        borderColor: Colors.WHITE,
        borderRadius: 100,
        marginRight: 10,
    },
    greetingContainer: {
        alignItems: 'center',
        marginRight: 10,
    },
    greetingText: {
        fontSize: 20,
        color: Colors.DEEP_RED,
        fontWeight: 'bold',
    },
})