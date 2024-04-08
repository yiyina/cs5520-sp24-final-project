import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import Colors from './Colors'

export default function DropDownList({ placeholder, listItems, handleItemSelect }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([])

    useEffect(() => {
        if (listItems && Array.isArray(listItems)) {
            const transformedList = listItems.map(item => ({
                label: item[1], value: item[0]
            }))
            setItems(transformedList)
            // console.log("DropDownList transformedList: ", transformedList);
        } else {
            setItems([]);
            console.log("listItems is not an array:", listItems);
        }
    }, [listItems])

    const handleValueChange = (itemValue) => {
        if (itemValue && itemValue != '') {
            setValue(itemValue)
            handleItemSelect(itemValue)
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
        height: 50,
        marginVertical: 10,
    },
})