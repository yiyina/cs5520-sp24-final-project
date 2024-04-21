import { StyleSheet, Text, Image, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../Shared/Colors'
import Home from '../Screens/Home'
import Search from '../Screens/Search'
import Gallery from '../Screens/Gallery'
import Spin from '../Screens/Spin'


export default function TabNavigation() {
    const Tab = createBottomTabNavigator();

    return (
        <>
            <Tab.Navigator screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.TEXT_COLOR,
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingTop: 10,
                    height: Dimensions.get('screen').height * 0.1,
                    ...styles.shadow,
                }
            }}>
                <Tab.Screen name="MainHome" component={Home}
                    options={{
                        tabBarLabel: ({ focused }) => (focused ? <Text style={styles.title}>HOME</Text> : null),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen name="Spin" component={Spin}
                    options={{
                        tabBarLabel: ({ focused }) => (focused ? <Text style={styles.title}>SPIN</Text> : null),
                        tabBarIcon: ({ color, size }) => (
                            // <MaterialCommunityIcons name="ferris-wheel" size={size} color={color} />
                            <Image source={require('../assets/spin-icon.png')} style={styles.spinIcon} />
                        ),
                    }}
                />
                <Tab.Screen name="Search" component={Search}
                    options={{
                        tabBarLabel: ({ focused }) => (focused ? <Text style={styles.title}>SEARCH</Text> : null),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="search-location" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen name="Gallery" component={Gallery}
                    options={{
                        tabBarLabel: ({ focused }) => (focused ? <Text style={styles.title}>GALLERY</Text> : null),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="photo" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        color: Colors.TEXT_COLOR,
        fontWeight: 'bold',
    },
    spinIcon: {
        width: 30,
        height: 30,
    },
});