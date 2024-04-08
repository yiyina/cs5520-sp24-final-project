import { StyleSheet, Pressable, View, Dimensions, Modal, Text, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { EvilIcons } from '@expo/vector-icons';
import Colors from '../../Shared/Colors'
import FirestoreService from '../../firebase-files/FirebaseHelpers'
import Button from '../../Shared/Button';
import Input from '../../Shared/Input';
import DropdownList from '../../Shared/DropDownList';
import ColorThemes from './DefaultColorSet';
import generateUUID from '../../Shared/GenerateUUID';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function EditSpin({ spinId, spinColorName }) {
    const [initialName, setInitialName] = useState('')
    const [spinName, setSpinName] = useState('')
    const [initialItems, setInitialItems] = useState([])
    // const [spinItems, setSpinItems] = useState([])
    const [initialTheme, setInitialTheme] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('')
    const [showEditSpinModal, setShowEditSpinModal] = useState(false)
    const [inputs, setInputs] = useState([{ value: '' }]);

    const themeOptions = Object.keys(ColorThemes).map(key => ([ColorThemes[key], key]));

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme);
    }

    useEffect(() => {
        console.log('EditSpin inputs:', inputs)
    }, [inputs])

    const fetchData = async () => {
        const spinsCollection = await FirestoreService.getSpinsCollection()
        const selectedSpin = spinsCollection.find(s => s.id === spinId)
        console.log('selectedSpin:', selectedSpin)
        if (selectedSpin) {
            setInitialName(selectedSpin.spinName)
            setSpinName(selectedSpin.spinName)
            setSelectedTheme(selectedSpin.spinColor)
            setInitialTheme(selectedSpin.spinColor)
            // if (!inputs) {
            //     const newInputs = selectedSpin.spinItems.map((item) => {
            //         return { id: generateUUID(), value: item };
            //     });
            //     setInputs(newInputs);
            //     setInitialItems(newInputs);
            // }
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

        await FirestoreService.addSpinToUser(spin, spinId);
        setShowEditSpinModal(false);
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
                        <Text>Edit Spin</Text>
                        <Text>Spin Name</Text>
                        <Input text={spinName} handleInput={setSpinName} />
                        <Text>Spin Colors</Text>
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
                        {
                            inputs.map((input) => (
                                <View style={styles.inputItem} key={input.id}>
                                    <Input
                                        text={input.value}
                                        handleInput={(value) => handleInputChange(value, input.id)}
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
                        <Button text={'DELETE'} buttonPress={handleDeleteSpin} defaultStyle={styles.saveButtonDefault} pressedStyle={styles.saveButtonPressed} />
                        <Button text="Close" buttonPress={handleCloseModal} />
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
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