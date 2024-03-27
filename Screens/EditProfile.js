import { StyleSheet, View, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Octicons } from '@expo/vector-icons';
import Colors from '../Shared/Colors';
import EditInfo from '../Components/EditProfile/EditInfo';

export default function EditProfile({ showProfile, onCancel }) {
    const [avatarUri, setAvatarUri] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");

    return (
        <Modal
            visible={showProfile}
            animationType="slide"
            transparent={true}
            onRequestClose={onCancel}>
            <View style={styles.modalContainer}>
                <Pressable onPress={onCancel} style={styles.fold}>
                    <Octicons name="chevron-down" size={50} color="white" />
                </Pressable>
                <EditInfo
                    avatarUri={avatarUri} setAvatarUri={setAvatarUri}
                    userName={userName} setUserName={setUserName}
                    email={email} setEmail={setEmail}
                    showCamera={showCamera} setShowCamera={setShowCamera} />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    fold: {
        position: 'absolute',
        top: '7%',
        left: '50%',
        marginLeft: -35,
        width: 70,
        height: 70,
        borderRadius: 20,
        backgroundColor: Colors.LIGHT_RED,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
})
