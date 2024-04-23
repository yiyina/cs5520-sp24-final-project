import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../Shared/Colors'
import { validateUsername, validateEmail, validatePassword } from '../../Shared/InformationValidation';

export default function EditFields({ title, value, onChange, error, setError, editProfilePressed }) {
    const isPassword = title === 'Password';

    // Validate the input field based on the field name
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

    // Set the input field style based on the editProfilePressed state
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
        color: Colors.TEXT_COLOR,
    },
    editableFieldInput: {
        backgroundColor: Colors.WHITE,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.TEXT_COLOR,
    },
    nonEditableFieldInput: {
        backgroundColor: Colors.INVALID_TEXT,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.TEXT_COLOR,
    },
    errorField: {
        color: Colors.DARK_RED,
        height: 20,
        marginTop: 5,
        flexWrap: 'wrap',
    },
})