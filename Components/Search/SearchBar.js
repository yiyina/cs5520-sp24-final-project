import { StyleSheet, Text, View, Dimensions, TextInput, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../Shared/Colors';
import { Ionicons } from '@expo/vector-icons';
import Weather from '../../Shared/Weather';
import Button from '../../Shared/Button';
import AddSpin from '../Spin/AddSpin';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchBar({ setSearchText, spinValue, playList }) {
    const [searchInput, setSearchInput] = useState(spinValue || '');
    const [showAddSpinModal, setShowAddSpinModal] = useState(false);

    useEffect(() => {
        setSearchInput(spinValue);
    }, [spinValue]);

    const handleTextChange = (text) => {
        setSearchInput(text);
    }

    const handleSubmit = () => {
        setSearchText(searchInput);
    }

    const handlePress = () => {
        if (!searchInput) {
            Alert.alert('Please search for a place first');
            return;
        }
        setSearchText(searchInput);
    }

    const handleAddSpin = () => {
        console.log("SearchBar.js searchInput: ", searchInput);
        if (!searchInput) {
            Alert.alert('Please search for a place first');
            return;
        }
        setShowAddSpinModal(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover</Text>
                <Weather />
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder={searchInput || "Search"}
                    value={searchInput}
                    style={styles.searchBar}
                    onChangeText={handleTextChange}
                    onSubmitEditing={handleSubmit}
                    keyboardType="default"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.searchIcon,
                        { backgroundColor: pressed ? Colors.DARK_COLOR : Colors.TRANSPARENT },
                    ]}
                    onPress={handlePress}>
                    <Ionicons name="search" size={24} color={Colors.DARK_GRAY} />
                </Pressable>
                <LinearGradient
                    colors={[Colors.CORAL, Colors.BORDER_GOLD, Colors.CORAL]}
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 1.0, y: 1.0 }}
                    style={{
                        ...styles.default,
                    }}
                >
                    <Button
                        text={'Create Spin'}
                        textColor={Colors.WHITE}
                        buttonPress={handleAddSpin}
                        textStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        defaultStyle={styles.default}
                        pressedStyle={styles.pressed}
                    />
                </LinearGradient>
                <AddSpin
                    showAddSpinModal={showAddSpinModal}
                    setShowAddSpinModal={setShowAddSpinModal}
                    searchInput={searchInput}
                    playList={playList} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.2,
        // backgroundColor: Colors.MAIN_BACKGROUND,
        paddingHorizontal: 20,
        paddingTop: 20,
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
        fontWeight: 'bold',
        color: Colors.TEXT_COLOR,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        backgroundColor: Colors.WHITE,
        borderColor: Colors.BORDER_GOLD,
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 2,
        paddingHorizontal: 10,
        width: '65%',
        height: 40,
        marginRight: 10,
    },
    searchIcon: {
        position: 'absolute',
        left: Dimensions.get('screen').width * 0.5,
        width: 40,
        height: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    default: {
        borderRadius: 10,
        margin: 0,
    },
    pressed: {
        backgroundColor: Colors.BORDER_GOLD,
        borderRadius: 10,
        opacity: 0.5,
        margin: 0,
    },
});
