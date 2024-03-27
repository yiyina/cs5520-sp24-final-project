import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

export default function EditFields({ title, type, setType, editProfilePressed }) {
    const isPassword = title === 'Password';
    const handleFocus = () => {
        if (isPassword && editProfilePressed) {
            setType("");
        }
    }

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>{title} : </Text>
            {editProfilePressed ? (
                <TextInput 
                    style={styles.fieldInput} 
                    value={type} 
                    onChangeText={setType}
                    secureTextEntry={isPassword}
                    onFocus={handleFocus}
                />
            ) : (
                <Text>{isPassword ? "*********" : type}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        margin: 20,
    },
    fieldText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    fieldInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: 'black',
        marginLeft: 10,
        padding: 5,
    },
})