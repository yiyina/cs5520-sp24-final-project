import { StyleSheet, Text, Modal, View, Pressable } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons';

export default function AddSpin({ showAddSpinModal, onCancel }) {
    return (
        <Modal
            visible={showAddSpinModal}
            animationType="slide"
            onRequestClose={onCancel}>
            <View style={styles.modalContainer}>
                <Text>AddSpin</Text>
                <Pressable onPress={onCancel} style={styles.fold}>
                    <Octicons name="chevron-down" size={50} color="black" />
                </Pressable>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})