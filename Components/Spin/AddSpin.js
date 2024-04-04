import { StyleSheet, Text, Modal, View, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Octicons } from '@expo/vector-icons';
import Input from '../../Shared/Input'
import ColorThemes from './DefaultColorSet'
import DropDownList from '../../Shared/DropDownList';

export default function AddSpin({ showAddSpinModal, onCancel }) {
    const [inputs, setInputs] = useState(['']);
    const [selectedTheme, setSelectedTheme] = useState('');
    const [themes, setThemes] = useState(ColorThemes);
    console.log('Themes:', themes["chocolate"]);

    const themeOptions = Object.keys(themes).map(key => ([themes[key], key]));
    const selectedThemeColors = themes[selectedTheme];
    console.log('Theme Options:', selectedTheme);

    const handleThemeSelect = (item) => {
        setSelectedTheme(item);
        console.log('Selected Theme:', item);
    }

    const addInput = () => {
        setInputs([...inputs, ''])
    };

    const handleInputChange = (text, index) => {
        const newInputs = [...inputs];
        newInputs[index] = text;
        setInputs(newInputs);
    };

    const saveInputs = () => {
        console.log('Inputs:', inputs);
    }

    return (
        <Modal
            visible={showAddSpinModal}
            animationType="slide"
            transparent={true}
            onRequestClose={onCancel}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Pressable onPress={onCancel} style={styles.fold}>
                        <Octicons name="chevron-down" size={50} color="black" />
                    </Pressable>
                    <Text>Add Spin</Text>
                    <Text>Select Theme</Text>
                    <DropDownList
                        placeholder="Select a Theme"
                        listItems={themeOptions}
                        handleItemSelect={handleThemeSelect}
                        selectedSpin={selectedTheme} />
                    <ScrollView horizontal style={styles.colorPalette}>
                        {selectedTheme && selectedTheme.map((color, index) => (
                            <View key={index} style={[styles.colorBox, { backgroundColor: color }]}></View>
                        ))}
                    </ScrollView>
                    <Text>Name of Spin</Text>
                    <Input placeholder="Spin Name" />
                    <Text>Spin Items</Text>
                    {
                        inputs.map((input, index) => (
                            <Input
                                key={index}
                                placeholder="Spin Item"
                                value={inputs[index]}
                                onChangeText={(text) => handleInputChange(text, index)}
                            />
                        ))
                    }
                    <Pressable onPress={addInput}>
                        <Text>+</Text>
                    </Pressable>
                    <Pressable onPress={saveInputs}>
                        <Text>Save</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        height: '90%',
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    fold: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorPalette: {
        marginTop: 10,
        maxHeight: 50,
    },
    colorBox: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
})