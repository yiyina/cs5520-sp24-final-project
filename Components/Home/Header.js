import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, firestore } from '../../firebase-files/FirebaseSetup'
import { onSnapshot, collection, query, where } from "firebase/firestore";
import Colors from '../../Shared/Colors'
import Avatar from '../../Shared/Avatar'

export default function Header() {
    const [user, setUser] = useState(auth.currentUser || null);
    const [username, setUsername] = useState(null);
    const [avatarUri, setAvatarUri] = useState(null);

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
                console.log("User data found in firestore: ", querySnapshot.docs[0].data());
                setAvatarUri({ uri: querySnapshot.docs[0].data().avatar });
                setUsername(querySnapshot.docs[0].data().username);
            },
            (error) => {
                console.error(error.message);
            }
        );
        return () => {
            console.log("unsubscribe");
            unsubscribe();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.greeting}>
                <Text>Welcome, {user ? username : 'Guest'}</Text>
            </View>
            <View style={styles.avatarContainer}>
                <Avatar avatarUri={avatarUri} size={50} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 50,
        borderWidth: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarContainer: {
        borderWidth: 5,
        borderColor: Colors.WHITE,
        borderRadius: 100,
    },
    greeting: {
        alignItems: 'center',
        marginRight: 10,
    },
})