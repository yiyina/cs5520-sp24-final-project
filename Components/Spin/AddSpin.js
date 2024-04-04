import { StyleSheet, Text, Modal, View, Pressable, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Octicons } from '@expo/vector-icons';
import Input from '../../Shared/Input'
import ColorThemes from './DefaultColorSet'
import DropDownList from '../../Shared/DropDownList';
import FirestoreService from '../../firebase-files/FirebaseHelpers';

export default function AddSpin({ showAddSpinModal, setShowAddSpinModal }) {
    const [spinName, setSpinName] = useState('');
    const [themes, setThemes] = useState(ColorThemes);
    const [inputs, setInputs] = useState(['']);
    const [selectedTheme, setSelectedTheme] = useState('');

    const themeOptions = Object.keys(themes).map(key => ([themes[key], key]));

    const handleThemeSelect = (item) => {
        setSelectedTheme(item);
    }

    const addInput = () => {
        const hasEmptyInput = inputs.some(input => input.trim() === '');

        if (hasEmptyInput) {
            Alert.alert('Alert', 'Please fill out all empty fields');
            return;
        }
        setInputs([...inputs, ''])
    };

    const handleSpinName = (text) => {
        setSpinName(text);
    }

    const handleInputChange = (text, index) => {
        const newInputs = [...inputs];
        newInputs[index] = text;
        setInputs(newInputs);
    };

    const saveInputs = async () => {
        console.log('selectedTheme:', selectedTheme);
        console.log('spinName:', spinName);
        console.log('Inputs:', inputs);
        const hasEmptyInput = inputs.some(input => input.trim() === '');

        if (!selectedTheme || !spinName || hasEmptyInput) {
            Alert.alert('Alert', 'Please fill out all fields');
            return;
        };

        const spin = {
            spinColor: selectedTheme,
            spinItems: inputs,
            spinName: spinName,
        }
        await FirestoreService.addSpinToUser(spin);
        setShowAddSpinModal(false);
    }

    const onCancelModified = () => {
        setShowAddSpinModal(false);
        setInputs(['']);
        setSelectedTheme('');
    }

    return (
        <Modal
            visible={showAddSpinModal}
            animationType="slide"
            transparent={true}
            onRequestClose={onCancelModified}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Pressable onPress={onCancelModified} style={styles.fold}>
                        <Octicons name="chevron-down" size={50} color="black" />
                    </Pressable>
                    <Text>Add Spin</Text>
                    <Text>Select Theme</Text>
                    <DropDownList
                        listItems={themeOptions}
                        handleItemSelect={handleThemeSelect}
                        selectedSpin={selectedTheme} />
                    <ScrollView horizontal style={styles.colorPalette}>
                        {selectedTheme && selectedTheme.map((color, index) => (
                            <View key={index} style={[styles.colorBox, { backgroundColor: color }]}></View>
                        ))}
                    </ScrollView>
                    <Text>Name of Spin</Text>
                    <Input value={spinName} handleInput={handleSpinName} />
                    <Text>Spin Items</Text>
                    {
                        inputs.map((input, index) => (
                            <Input
                                key={index}
                                value={inputs}
                                handleInput={(text) => handleInputChange(text, index)}
                                onSubmitEditing={addInput}
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
        width: 70,
        height: 25,
        marginRight: 10,
        borderRadius: 5,
    },
})