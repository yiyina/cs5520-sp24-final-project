import { StyleSheet, Text, View, Pressable, Image, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../Shared/Colors'
import Avatar from '../../Shared/Avatar'
import { getUpdatedUserData } from '../../Shared/updateUserData'
import EditProfile from '../../Screens/EditProfile'
import { AntDesign } from '@expo/vector-icons';

export default function Header() {
    const { username, avatarUri } = getUpdatedUserData();
    const [greeting, setGreeting] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const [day, setDay] = useState(true);

    useEffect(() => {
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
        setGreeting(getGreetingBasedOnTime());
    }, []);

    useEffect(() => {
        const date = new Date();
        const hours = date.getHours();
        if (hours >= 6 && hours < 18) {
            setDay(true);
        } else {
            setDay(false);
        }
    }, []);

    const toggleEditProfile = () => {
        setShowProfile(!showProfile);
    }

    return (
        <View style={styles.container}>
            {day ?
                <Image source={require('../../assets/sun1.gif')} style={styles.gif} />
                :
                <Image source={require('../../assets/moon0.gif')} style={styles.gif} />
            }
            <View style={styles.avatarContainer}>
                <Avatar avatarUri={avatarUri} size={80} />
            </View>
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingName}>Hi, {username || 'Guest'}</Text>
                <Text style={styles.greetingText}>{greeting} !</Text>
            </View>
            <Pressable onPress={toggleEditProfile} style={styles.editProfile}>
                <AntDesign name="profile" size={36} color={Colors.TEXT_COLOR} />
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
    gif: {
        position: 'absolute',
        top: Dimensions.get('window').width * 0.05,
        right: Dimensions.get('window').width * 0.15,
        width: 100,
        height: 100,
        zIndex: -1,
    },
})