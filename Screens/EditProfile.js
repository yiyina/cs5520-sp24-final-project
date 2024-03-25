import { StyleSheet, Text, View, Modal, Pressable } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons';
import Colors from '../Shared/Colors';

export default function EditProfile({ showProfile, onCancel }) {
    return (
        <Modal
            visible={showProfile}
            animationType="slide"
            transparent={true}
            onRequestClose={onCancel}>
            <View style={styles.modalContainer}>
                <Pressable onPress={onCancel} style={styles.fold}>
                    <Octicons name="chevron-down" size={24} color="white" />
                </Pressable>
                <View style={styles.modalContent}>
                    <Text>Edit Profile</Text>
                    <Text>Username : </Text>
                    
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        height: '80%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderRadius: 55,
        borderWidth: 5,
        borderColor: Colors.DARK_YELLOW,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fold: {
        position: 'absolute',
        top: '18%',
        left: '50%',
        marginLeft: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.DEEP_RED,
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1,
    }
})
