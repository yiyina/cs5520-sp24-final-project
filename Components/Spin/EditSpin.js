import { StyleSheet, Pressable, View, Dimensions, Modal, Text, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { EvilIcons } from '@expo/vector-icons';
import Colors from '../../Shared/Colors'
import FirestoreService from '../../firebase-files/FirebaseHelpers'
import Button from '../../Shared/Button';
import Input from '../../Shared/Input';
import DropdownList from '../../Shared/DropDownList';
import HorizontalLine from '../../Shared/HorizontalLine';
import ColorThemes from './DefaultColorSet';
import generateUUID from '../../Shared/GenerateUUID';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

export default function EditSpin({ spinId, spinColorName }) {
    const [initialName, setInitialName] = useState('')
    const [spinName, setSpinName] = useState('')
    const [initialItems, setInitialItems] = useState([])
    const [initialTheme, setInitialTheme] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('')
    const [showEditSpinModal, setShowEditSpinModal] = useState(false)
    const [inputs, setInputs] = useState([{ value: '' }]);

    const themeOptions = Object.keys(ColorThemes).map(key => ([ColorThemes[key], key]));

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme);
    }

    // useEffect(() => {
    //     console.log('EditSpin inputs:', inputs)
    // }, [inputs])

    const fetchData = async () => {
        const spinsCollection = await FirestoreService.getSpinsCollection()
        const selectedSpin = spinsCollection.find(s => s.id === spinId)
        console.log('selectedSpin:', selectedSpin)
        if (selectedSpin) {
            setInitialName(selectedSpin.spinName)
            setSpinName(selectedSpin.spinName)
            setSelectedTheme(selectedSpin.spinColor)
            setInitialTheme(selectedSpin.spinColor)
            const newInputs = selectedSpin.spinItems.map(async (item) => {
                return { id: generateUUID(), value: item };
            });
            setInputs(await Promise.all(newInputs));
            setInitialItems(await Promise.all(newInputs))
        }
    }

    useEffect(() => {
        fetchData()
    }, [spinId])

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
        console.log('newId:', newId);
        setInputs(inputs => [...inputs, { id: newId, value: '' }]);
    };

    const handleInputChange = (text, id) => {
        setInputs(inputs => inputs.map(input =>
            input.id === id ? { ...input, value: text } : input
        ));
    }

    const editHandler = () => {
        setShowEditSpinModal(true)
    }

    const removeInput = (idToRemove) => {
        if (inputs.length > 1 || inputs.find(input => input.id === idToRemove).value.trim() !== '') {
            const updatedInputs = inputs.filter(input => input.id !== idToRemove);
            setInputs(updatedInputs);
        } else {
            Alert.alert('Warning', 'Cannot remove the last input.');
        }
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

        console.log('EditSpin.js spin:', spin, spinId);

        try {
            await FirestoreService.addSpinToUser(spin, spinId);
            Alert.alert('Success', 'Spin successfully updated!');
            setShowEditSpinModal(false);
        } catch (error) {
            console.log("Error saving inputs: ", error);
        }
    }

    const handleCloseModal = () => {
        setShowEditSpinModal(false);
        setSpinName(initialName);
        setSelectedTheme(initialTheme);
        setInputs(initialItems);
    }

    const handleDeleteSpin = async () => {
        const spins = await FirestoreService.getSpinsCollection();
        if (spins.length === 1) {
            Alert.alert('Warning', 'You cannot delete the last spin');
            return;
        } else {
            Alert.alert(
                'Warning',
                'Are you sure you want to delete this spin?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },
                    {
                        text: 'DELETE',
                        onPress: async () => {
                            await FirestoreService.deleteSpin(spinId);
                            setShowEditSpinModal(false);
                            fetchData();
                        },
                        style: 'destructive',
                    }
                ],
                { cancelable: false }
            );
        }
    }

    return (
        <View>
            <Pressable style={styles.editButton} onPress={editHandler}>
                <EvilIcons name="pencil" size={60} color={Colors.WHITE} />
            </Pressable>
            <Modal
                visible={showEditSpinModal}
                animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Edit Spin</Text>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.subTitile}>Spin Name</Text>
                        </View>
                        <Input text={spinName} handleInput={setSpinName} />
                        <View style={{ width: '100%' }}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.subTitile}>Choose Theme</Text>
                                <Ionicons name="color-palette-outline" size={24} color="black" style={styles.palette} />
                            </View>
                        </View>
                        <DropdownList
                            placeholder={spinColorName}
                            listItems={themeOptions}
                            handleItemSelect={handleThemeSelect}
                            selectedSpin={selectedTheme}
                        />
                        <ScrollView horizontal style={styles.colorPalette}>
                            {selectedTheme && selectedTheme.map((color, index) => (
                                <View key={index} style={[styles.colorBox, { backgroundColor: color }]}></View>
                            ))}
                        </ScrollView>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.subTitile}>Spin Items</Text>
                        </View>
                        <ScrollView style={{ minHeight: 50, maxHeight: 350 }}>
                            {
                                inputs.map((input) => (
                                    <View style={styles.inputItem} key={input.id}>
                                        <View style={styles.inputText}>
                                            <Input
                                                text={input.value}
                                                handleInput={(value) => handleInputChange(value, input.id)}
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
                        <View style={styles.buttonsContainer}>
                            <Button text={'SAVE'} buttonPress={saveInputs} defaultStyle={styles.saveButtonDefault} pressedStyle={styles.saveButtonPressed} />
                            <Button text={'DELETE'} buttonPress={handleDeleteSpin} defaultStyle={styles.saveButtonDefault} pressedStyle={styles.saveButtonPressed} />
                        </View>
                        <HorizontalLine />
                        <Pressable onPress={handleCloseModal} style={styles.fold}>
                            <Octicons name="chevron-down" size={50} color="black" />
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    editButton: {
        right: Dimensions.get('window').width * 0.1,
        bottom: Dimensions.get('window').height * 0.2,
        position: 'absolute',
        borderRadius: 50,
        height: 60,
        width: 60,
        backgroundColor: Colors.BLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        height: '98%',
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
        height: 40,
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    }
})