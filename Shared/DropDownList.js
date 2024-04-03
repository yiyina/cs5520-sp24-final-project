import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import Colors from './Colors'

export default function DropDownList({ placeholder, listItems, handleItemSelect, selectedSpin }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(selectedSpin || null)
    const [items, setItems] = useState([])

    useEffect(() => {
        if (listItems && Array.isArray(listItems)) {
            const transformedList = listItems.map(item => ({
                label: item, value: item
            }))
            setItems(transformedList)
        }
    }, [listItems])

    useEffect(() => {
        if (selectedSpin != value && selectedSpin) {
            setValue(selectedSpin);
        }
    }, [selectedSpin])

    const handleValueChange = (itemValue) => {
        if (itemValue && itemValue != '') {
            setValue(itemValue)
            handleItemSelect(itemValue)
        }
    }

    return (
        <DropDownPicker
            style={styles.dropDown}
            labelStyle={styles.label}
            textStyle={styles.text}
            placeholder={placeholder}
            placeholderStyle={{ color: Colors.BLACK }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={handleValueChange}
        />
    )
}

const styles = StyleSheet.create({
    dropDown: {
        backgroundColor: Colors.TRANSPARENT,
        borderColor: Colors.BLACK,
        borderWidth: 2,
    },
    label: {
        color: Colors.BLACK,
    },
    text: {
        color: Colors.BLACK,
    },
})