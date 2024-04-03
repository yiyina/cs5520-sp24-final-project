import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import Colors from './Colors'

export default function DropDownList({ placeholder, listItems, handleItemSelect, selectedSpin }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(selectedSpin || null)
    const [items, setItems] = useState([])

    useEffect(() => {
        console.log("DropDownList listItems: ", listItems)
        if (listItems && Array.isArray(listItems)) {
            const transformedList = listItems.map(item => ({
                label: item[1], value: item[0]
            }))
            console.log("DropDownList transformedList: ", transformedList)
            setItems(transformedList)
        }
    }, [])

    // useEffect(() => {
    //     if (selectedSpin != value && selectedSpin) {
    //         setValue(selectedSpin);
    //     }
    // }, [])

    const handleValueChange = (itemValue) => {
        console.log("DropDownList handleValueChange: ", items)
        if (itemValue && itemValue != '') {
            setValue(itemValue)
            handleItemSelect(items)
        }
    }

    return (
        <DropDownPicker
            style={styles.dropDown}
            dropDownStyle={styles.dropDownContainer}
            // labelStyle={styles.label}
            // textStyle={styles.text}
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
    dropDownContainer: {
        backgroundColor: Colors.WHITE,
    },
    dropDown: {
        height: 50
    },
})