import { StyleSheet, Text, Modal, View, Pressable } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons';

export default function AddSpin({ showAddSpinModal, onCancel }) {
    
    return (
        <Modal
            visible={showAddSpinModal}
            animationType="slide"
            transparent={true}
            onRequestClose={onCancel}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Pressable onPress={onCancel} style={styles.fold}>
                        <Octicons name="chevron-down" size={50} color="black" />
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        height: '90%',
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    fold: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})