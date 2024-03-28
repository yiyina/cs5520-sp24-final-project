import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import Colors from '../../Shared/Colors'

export default function EditFields({ title, type, setType, editProfilePressed }) {
    const isPassword = title === 'Password';

    const inputStyle = editProfilePressed ? styles.editableFieldInput : styles.nonEditableFieldInput;

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>{title} : </Text>
            <TextInput 
                style={inputStyle} 
                value={type} 
                onChangeText={setType}
                secureTextEntry={isPassword}
                editable={editProfilePressed}
                onFocus={isPassword ? () => setType("") : null}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    fieldContainer: {
        justifyContent: 'end',
        width: '80%',
        margin: 10,
    },
    fieldText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    editableFieldInput: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 5,
        padding: 15,
        borderRadius: 5, 
    },
    nonEditableFieldInput: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        marginTop: 5,
        padding: 15,
        borderRadius: 5, 
    },
})