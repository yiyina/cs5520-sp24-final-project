import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../Shared/Colors'
import { validateUsername, validateEmail, validatePassword } from '../../Shared/InformationValidation';

export default function EditFields({ title, value, onChange, error, setError, editProfilePressed }) {
    const isPassword = title === 'Password';

    const handleValidation = (newValue) => {
        let validationResult = '';
        switch(title) {
            case 'Username':
                validationResult = validateUsername(newValue);
                break;
            case 'Email':
                validationResult = validateEmail(newValue);
                break;
            case 'Password':
                validationResult = validatePassword(newValue);
                break;
            default:
                validationResult = '';
        }
        setError(validationResult);
        onChange(newValue);
    }

    const inputStyle = editProfilePressed ? styles.editableFieldInput : styles.nonEditableFieldInput;

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>{title} : </Text>
            <TextInput
                style={inputStyle}
                value={value}
                onChangeText={handleValidation}
                secureTextEntry={isPassword}
                editable={editProfilePressed}
            />
            {error ?
                <Text style={styles.errorField} numberOfLines={2}>{error}</Text>
                :
                <Text style={styles.errorField} numberOfLines={2}></Text>}
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
        backgroundColor: Colors.WHITE,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
    },
    nonEditableFieldInput: {
        backgroundColor: Colors.INVALID_TEXT,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
    },
    errorField: {
        color: Colors.DARK_RED,
        height: 20,
        flexWrap: 'wrap',
    },
})