import { StyleSheet, Text, View, Dimensions, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Shared/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ setSearchText }) {
    const [searchInput, setSearchInput] = useState('');

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.LIGHT_YELLOW, Colors.GRAY]}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Discover</Text>
                    {/* <Image source={require('../../assets/default_avatar.png')} style={styles.avatar} /> */}
                </View>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search"
                        style={styles.searchBar}
                        onChangeText={(value) => setSearchInput(value)}
                        onSubmitEditing={() => setSearchText(searchInput)}
                    />
                    <Pressable 
                        style={({ pressed }) => [
                            styles.searchIcon,
                            {backgroundColor: pressed ? Colors.DARK_YELLOW : Colors.TRANSPARENT},
                        ]}
                        onPress={() => setSearchText(searchInput)}>
                        <Ionicons name="search" size={24} color={Colors.DARK_GRAY} />
                    </Pressable>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width,
    },
    gradient: {
        padding: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 35,
        color: Colors.DARK_GRAY,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    searchBar: {
        backgroundColor: Colors.WHITE,
        borderColor: Colors.LIGHT_GRAY,
        borderWidth: 1,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        paddingHorizontal: 10,
        width: '90%',
        height: 40,
        marginRight: 10,
    },
    searchIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
