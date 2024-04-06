import { StyleSheet, Pressable, View, Dimensions, Modal, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { EvilIcons } from '@expo/vector-icons';
import Colors from '../../Shared/Colors'
import FirestoreService from '../../firebase-files/FirebaseHelpers'
import Button from '../../Shared/Button';
import Input from '../../Shared/Input';
import DropdownList from '../../Shared/DropDownList';
import ColorThemes from './DefaultColorSet';

export default function EditSpin({ spinId, spinColorName }) {
    const [spinName, setSpinName] = useState('')
    const [spinItems, setSpinItems] = useState([])
    const [spinColor, setSpinColor] = useState([])
    const [colorName, setColorName] = useState(spinColorName)
    const [themes, setThemes] = useState(ColorThemes);
    const [showEditSpinModal, setShowEditSpinModal] = useState(false)
    const themeOptions = Object.keys(themes).map(key => ([themes[key], key]));

    useEffect(() => {
        async function fetchData() {
            const spinsCollection = await FirestoreService.getSpinsCollection()
            const selectedSpin = spinsCollection.find(s => s.id === spinId)
            if (selectedSpin) {
                setSpinName(selectedSpin.spinName)
                setSpinItems(selectedSpin.spinItems)
                setSpinColor(selectedSpin.spinColor)
            }
        }
        fetchData()
    }, [spinId])

    const editHandler = () => {
        console.log('Edit button clicked')
        console.log('spinId:', spinId)
        setShowEditSpinModal(true)
    }

    return (
        <View>
            <Pressable style={styles.container} onPress={editHandler}>
                <EvilIcons name="pencil" size={60} color={Colors.WHITE} />
            </Pressable>
            <Modal
                visible={showEditSpinModal}>
                <View style={styles.modalContainer}>
                    <Text>Edit Spin</Text>
                    <Text>Spin Name</Text>
                    <Input text={spinName} inputChange={setSpinName} />
                    <Text>Spin Colors</Text>
                    <DropdownList
                        placeholder={spinColorName}
                        listItems={themeOptions}
                        handleItemSelect={setSpinColor}
                        selectedSpin={setColorName}
                    />
                    <Button text="Close" buttonPress={() => setShowEditSpinModal(false)} />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})