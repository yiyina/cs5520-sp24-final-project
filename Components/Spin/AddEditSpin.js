import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Octicons, Feather } from '@expo/vector-icons';
import Colors from '../../Shared/Colors';
import FirestoreService from '../../firebase-files/FirebaseHelpers';
import Button from '../../Shared/Button';
import Input from '../../Shared/Input';
import DropDownList from '../../Shared/DropDownList';
import ColorThemes from './DefaultColorSet';

export default function AddEditSpin({ showAddEditSpinModal, setShowAddEditSpinModal, spinId = null, spinColorName = '' }) {
    const [spinName, setSpinName] = useState('');
    const [themes, setThemes] = useState(ColorThemes);
    const [inputs, setInputs] = useState([{ id: Date.now(), value: '' }]);
    const [selectedTheme, setSelectedTheme] = useState('');

    const themeOptions = Object.keys(themes).map(key => ([themes[key], key]));

    useEffect(() => {
        async function fetchData() {
            if (spinId) {
                const spinsCollection = await FirestoreService.getSpinsCollection();
                const selectedSpin = spinsCollection.find(s => s.id === spinId);
                if (selectedSpin) {
                    setSpinName(selectedSpin.spinName);
                    setInputs(selectedSpin.spinItems.map(item => ({ id: Date.now() + Math.random(), value: item })));
                    setSelectedTheme(selectedSpin.spinColor);
                }
            }
        }
        fetchData();
    }, [spinId]);

    const handleThemeSelect = (item) => {
        setSelectedTheme(item);
    };

    const addInput = () => {
        const hasEmptyInput = inputs.some(input => input.value.trim() === '');
        if (inputs.length >= 10) {
            Alert.alert('Alert', 'You can only have 10 items');
            return;
        }

        if (hasEmptyInput) {
            Alert.alert('Alert', 'Please fill out all empty fields');
            return;
        }

        const newId = Date.now() + Math.random();
        setInputs(inputs => [...inputs, { id: newId, value: '' }]);
    };

    const handleInputChange = (text, id) => {
        setInputs(inputs => inputs.map(input =>
            input.id === id ? { ...input, value: text } : input
        ));
    };

    const saveInputs = async () => {
        const hasEmptyInput = inputs.some(input => input.value.trim() === '');

        if (!selectedTheme || !spinName || hasEmptyInput) {
            Alert.alert('Alert', 'Please fill out all fields');
            return;
        };

        const spinItems = inputs.map(input => input.value);
        const spin = {
            spinColor: ColorThemes[selectedTheme],
            spinItems: spinItems,
            spinName: spinName,
        };

        if (spinId) {
            // Update existing spin
            await FirestoreService.updateSpin(spinId, spin);
        } else {
            // Add new spin
            await FirestoreService.addSpinToUser(spin);
        }

        setShowAddEditSpinModal(false);
    };

    const onCancelModified = () => {
        setShowAddEditSpinModal(false);
        setInputs([{ id: Date.now(), value: '' }]);
        setSelectedTheme('');
    };

    return (
        <Modal
            visible={showAddEditSpinModal}
            animationType="slide"
            transparent={true}
            onRequestClose={onCancelModified}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Pressable onPress={onCancelModified} style={styles.fold}>
                        <Octicons name="chevron-down" size={50} color="black" />
                    </Pressable>
                    <Text>{spinId ? 'Edit Spin' : 'Add Spin'}</Text>
                    <Text>Choose Theme</Text>
                    <DropDownList
                        listItems={themeOptions}
                        handleItemSelect={handleThemeSelect}
                        selectedSpin={selectedTheme} />
                    <ScrollView horizontal style={styles.colorPalette}>
                        {selectedTheme && ColorThemes[selectedTheme] && ColorThemes[selectedTheme].map((color, index) => (
                            <View key={index} style={[styles.colorBox, { backgroundColor: color }]}></View>
                        ))}
                    </ScrollView>
                    <Text>Name of Spin</Text>
                    <Input value={spinName} handleInput={setSpinName} />
                    <Text>Spin Items</Text>
                    {
                        inputs.map((input) => (
                            <Input
                                key={input.id}
                                value={input.value}
                                handleInput={(text) => handleInputChange(text, input.id)}
                                onSubmitEditing={addInput}
                            />
                        ))
                    }
                    <Pressable onPress={addInput} style={styles.plusButton}>
                        <Feather name="plus-square" size={36} color="black" />
                    </Pressable>
                    <Button text={'SAVE'} buttonPress={saveInputs} defaultStyle={styles.saveButtonDefault} pressedStyle={styles.saveButtonPressed} />
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
    plusButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonDefault: {
        backgroundColor: Colors.LIGHT_YELLOW,
        width: '50%',
        alignSelf: 'center',
        borderRadius: 10,
    },
    saveButtonPressed: {
        backgroundColor: Colors.DARK_YELLOW,
        width: '50%',
        alignSelf: 'center',
        borderRadius: 10,
    },
})