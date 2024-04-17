import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../Shared/Colors'
import Avatar from '../../Shared/Avatar'
import { getUpdatedUserData } from '../../Shared/updateUserData'

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
    
    useEffect(() => {
        setGreeting(getGreetingBasedOnTime());
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar avatarUri={avatarUri} size={80} />
            </View>
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>{username || 'Guest'}</Text>
                <Text style={styles.greetingText}>{greeting} !</Text>
            </View>
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
    greetingText: {
        fontSize: 20,
        color: Colors.TEXT_COLOR,
        fontWeight: 'bold',
    },
})