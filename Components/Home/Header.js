import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import FirestoreService from '../../firebase-files/FirebaseHelpers'
import { auth } from '../../firebase-files/FirebaseSetup'
import Colors from '../../Shared/Colors'
import Avatar from '../../Shared/Avatar'

export default function Header() {
    const [user, setUser] = useState(auth.currentUser || null);
    const [avatarUri, setAvatarUri] = useState(null);

    useEffect(() => {
        let unsubscribe = () => {};

        if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            unsubscribe = FirestoreService.onUserDataChange(uid, (userData) => {
                console.log("Received userData:", userData);
                if (userData && userData.avatar) {
                    setAvatarUri({ uri: userData.avatar });
                } else {
                    setAvatarUri(require('../../assets/default_avatar.png'));
                }
            });
        }
        console.log("Header mounted: ", unsubscribe);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log("Avatar URI updated: ", avatarUri);
    }, [avatarUri]); 

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar avatarUri={avatarUri} size={50} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    }
})