import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../Shared/Colors'
import Avatar from '../../Shared/Avatar'
import { getUpdatedUserData } from '../../Shared/updateUserData'
import EditProfile from '../../Screens/EditProfile'
import { AntDesign } from '@expo/vector-icons';

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
    const { username, avatarUri } = getUpdatedUserData();
    const [greeting, setGreeting] = useState('');
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        setGreeting(getGreetingBasedOnTime());
    }, []);

    const toggleEditProfile = () => {
        setShowProfile(!showProfile);
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar avatarUri={avatarUri} size={80} />
            </View>
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingName}>Hi, {username || 'Guest'}</Text>
                <Text style={styles.greetingText}>{greeting} !</Text>
            </View>
            <Pressable onPress={toggleEditProfile} style={styles.editProfile}>
                <AntDesign name="profile" size={36} color={Colors.TEXT_COLOR} />
                {/* <Text style={styles.text}>Profile</Text> */}
            </Pressable>
            <EditProfile
                showProfile={showProfile}
                onCancel={toggleEditProfile} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 50,
        marginBottom: 20,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    avatarContainer: {
        borderWidth: 5,
        borderColor: Colors.BORDER_GOLD,
        borderRadius: 100,
        marginRight: 10,
    },
    greetingContainer: {
        marginRight: 10,
    },
    greetingName: {
        fontSize: 40,
        color: Colors.TEXT_COLOR,
        fontWeight: 'bold',
    },
    greetingText: {
        fontSize: 20,
        color: Colors.TEXT_COLOR,
        fontWeight: 'bold',
    },
    editProfile: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    // text: {
    //   color: Colors.DEEP_RED,
    //   fontSize: 16,
    //   fontWeight: 'bold',
    //   marginTop: 5,
    // },
})