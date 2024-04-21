import { StyleSheet, View } from 'react-native'
import React from 'react'
import Button from '../../Shared/Button'
import Colors from '../../Shared/Colors'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';

export default function NavToSpin() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.CORAL, Colors.BORDER_GOLD, Colors.CORAL]}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={{
                    ...styles.default,
                }}
            >
                <Button
                    text={"Spin to Explore"}
                    textColor={Colors.WHITE}
                    buttonPress={() => navigation.navigate("Spin")}
                    textStyle={styles.text}
                    defaultStyle={styles.default}
                    pressedStyle={styles.pressed}
                />
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '60%',
        alignSelf: 'center',
    },
    default: {
        borderRadius: 10,
        margin: 0,
    },
    pressed: {
        backgroundColor: Colors.BORDER_GOLD,
        borderRadius: 10,
        opacity: 0.5,
        margin: 0,
    },
    text: {
        fontSize: 20,
    },
})