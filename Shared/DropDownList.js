import { StyleSheet } from 'react-native'
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
    dropDownContainer: {
        backgroundColor: Colors.WHITE,
        borderColor: Colors.BORDER_GOLD,
    },
    dropDown: {
        height: 50,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: Colors.BORDER_GOLD,
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.TEXT_COLOR,
    },
})