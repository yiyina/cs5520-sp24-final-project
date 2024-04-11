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
import { Ionicons } from '@expo/vector-icons';
import HorizontalLine from '../../Shared/HorizontalLine';

export default function AddSpin({ showAddSpinModal, setShowAddSpinModal }) {
    const [spinName, setSpinName] = useState('');
    const [themes, setThemes] = useState(ColorThemes);
    const [inputs, setInputs] = useState([{ value: '' }]);
    const [selectedTheme, setSelectedTheme] = useState('');

    const themeOptions = Object.keys(themes).map(key => ([themes[key], key]));

    const handleThemeSelect = (item) => {
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

        try {
            await FirestoreService.addSpinToUser(spin);
            Alert.alert('Success', 'Spin successfully created!');
            onCancelModified();
        } catch (error) {
            console.error("Error saving spin: ", error);
            Alert.alert('Error', 'Failed to save the spin');
        }
    }

    const onCancelModified = () => {
        setShowAddSpinModal(false);
        setInputs([{ value: '' }]);
        setSelectedTheme('');
    }

    return (
        <Modal
            visible={showAddSpinModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Add Spin</Text>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.subTitile}>Choose Theme</Text>
                        <Ionicons name="color-palette-outline" size={24} color="black" style={styles.palette} />
                    </View>
                    <DropDownList
                        listItems={themeOptions}
                        handleItemSelect={handleThemeSelect}
                        selectedSpin={selectedTheme} />
                    {selectedTheme &&
                        <ScrollView horizontal style={styles.colorPalette}>
                            {selectedTheme && selectedTheme.map((color, index) => (
                                <View key={index} style={[styles.colorBox, { backgroundColor: color }]}></View>
                            ))}
                        </ScrollView>
                    }
                    <View style={{ width: '100%' }}>
                        <Text style={styles.subTitile}>Name of Spin</Text>
                    </View>
                    <Input value={spinName} handleInput={setSpinName} />
                    <View style={{ width: '100%' }}>
                        <Text style={styles.subTitile}>Spin Items</Text>
                    </View>
                    <ScrollView style={{ minHeight: 50, maxHeight: 250 }}>
                        {
                            inputs.map((input) => (
                                <View key={input.id} style={styles.inputItem}>
                                    <View style={styles.inputText}>
                                        <Input
                                            text={input.value}
                                            handleInput={(text) => handleInputChange(text, input.id)}
                                        // onSubmitEditing={addInput}
                                        />
                                    </View>
                                    <View style={styles.removeIcon}>
                                        <Pressable onPress={() => removeInput(input.id)}>
                                            <AntDesign name="minuscircleo" size={24} color="red" />
                                        </Pressable>
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
                    <Pressable
                        onPress={addInput}
                        style={({ pressed }) => [
                            styles.plusButton,
                            pressed ? { backgroundColor: Colors.LIGHT_YELLOW } : { backgroundColor: Colors.WHITE }
                        ]}>
                        <Feather name="plus-square" size={36} color={Colors.DARK_YELLOW} />
                    </Pressable>
                    <Button text={'SAVE'} buttonPress={saveInputs} defaultStyle={styles.saveButtonDefault} pressedStyle={styles.saveButtonPressed} />
                    <HorizontalLine />
                    <Pressable onPress={onCancelModified} style={styles.fold}>
                        <Octicons name="chevron-down" size={50} color="black" />
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
        padding: 40,
        alignItems: 'center',
    },
    fold: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    subTitile: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    palette: {
        marginHorizontal: 5,
    },
    colorPalette: {
        maxHeight: 25,
    },
    colorBox: {
        width: 60,
        height: 25,
        marginRight: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    inputItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputText: {
        width: '90%',
    },
    removeIcon: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'flex-end',
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