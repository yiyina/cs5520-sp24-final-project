import { StyleSheet, Text, Modal, View, Pressable, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Octicons } from '@expo/vector-icons';
import Input from '../../Shared/Input'
import ColorThemes from './DefaultColorSet'
import DropDownList from '../../Shared/DropDownList';
import FirestoreService from '../../firebase-files/FirebaseHelpers';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Button from '../../Shared/Button';
import Colors from '../../Shared/Colors';
import generateUUID from '../../Shared/GenerateUUID';

export default function AddSpin({ showAddSpinModal, setShowAddSpinModal }) {
    const [spinName, setSpinName] = useState('');
    const [themes, setThemes] = useState(ColorThemes);
    const [inputs, setInputs] = useState([{ value: '' }]);
    const [selectedTheme, setSelectedTheme] = useState('');

    const themeOptions = Object.keys(themes).map(key => ([themes[key], key]));

    const handleThemeSelect = (item) => {
        console.log('AddSpin item:', item);
        setSelectedTheme(item);
    }

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
        setInputs(inputs => [...inputs, { id: generateUUID(), value: '' }]);
    };

    const removeInput = (idToRemove) => {
        const inputToRemove = inputs.find(input => input.id === idToRemove);
        if (inputToRemove && (inputs.length > 1 || (inputToRemove.value && inputToRemove.value.trim() !== ''))) {
            const updatedInputs = inputs.filter(input => input.id !== idToRemove);
            setInputs(updatedInputs);
        } else {
            Alert.alert('Warning', 'Cannot remove the last input.');
        }
    };

    const handleInputChange = (text, id) => {
        // const newInputs = [...inputs];
        // newInputs[index] = text;
        // setInputs(newInputs);
        setInputs(inputs => inputs.map(input =>
            input.id === id ? { ...input, value: text } : input
        ));
    };

    const saveInputs = async () => {
        console.log('selectedTheme:', selectedTheme);
        console.log('spinName:', spinName);
        console.log('Inputs:', inputs);
        const hasEmptyInput = inputs.some(input => input.value.trim() === '');

        if (!selectedTheme || !spinName || hasEmptyInput) {
            Alert.alert('Alert', 'Please fill out all fields');
            return;
        };

        const spinItems = inputs.map(input => input.value);
        const spin = {
            spinColor: selectedTheme,
            spinItems: spinItems,
            spinName: spinName,
        }

        await FirestoreService.addSpinToUser(spin);
        onCancelModified();
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
                    <Text>Choose Theme</Text>
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
                    <Input value={spinName} handleInput={setSpinName} />
                    <Text>Spin Items</Text>
                    {
                        inputs.map((input) => (
                            <View style={styles.inputItem}>
                                <Input
                                    key={input.id}
                                    text={input.value}
                                    handleInput={(text) => handleInputChange(text, input.id)}
                                    onSubmitEditing={addInput}
                                />
                                <Pressable onPress={() => removeInput(input.id)}>
                                    <AntDesign name="minuscircleo" size={24} color="black" />
                                </Pressable>
                            </View>
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
    inputItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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