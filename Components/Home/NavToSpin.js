import { StyleSheet, View } from 'react-native'
import React from 'react'
import Button from '../../Shared/Button'
import Colors from '../../Shared/Colors'
import { useNavigation } from '@react-navigation/native'

export default function NavToSpin() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Button
                text={"Spin to Explore"}
                textColor={Colors.TEXT_COLOR}
                buttonPress={() => navigation.navigate("Spin")}
                textStyle={styles.text}
                defaultStyle={styles.default}
                pressedStyle={styles.pressed}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignSelf: 'center',
        marginBottom: 5,
    },
    default: {
        backgroundColor: Colors.LIGHT_COLOR,
        borderRadius: 10,
    },
    pressed: {
        backgroundColor: Colors.DARK_COLOR,
        borderRadius: 10,
    },
    text: {
        color: Colors.TEXT_COLOR,
        fontSize: 20,
    }
})