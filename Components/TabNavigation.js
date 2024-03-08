import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from '../Screens/Home'
import Search from '../Screens/Search'
import Profile from '../Screens/Profile'
import Game from '../Screens/Game'
import Favorite from '../Screens/Favorite'


export default function TabNavigation() {
    const Tab = createBottomTabNavigator()
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            // tabBarShowLabel: false,
            tabBarStyle: {
                position: 'absolute',
                // bottom: 50,
                left: 20,
                right: 20,
                elevation: 0,
                backgroundColor: '#ffffff',
                borderRadius: 15,
                // height: 90,
                ...styles.shadow
            }
        }}>
            <Tab.Screen name="MainHome" component={Home} 
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen name="Search" component={Search} 
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="search1" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen name="Game" component={Game} 
                options={{
                    tabBarLabel: 'Game',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialIcons name="auto-awesome" size={24} color={color} />
                        <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen name="Favorite" component={Favorite} 
                options={{
                    tabBarLabel: 'Favorite',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="hearto" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={Profile} 
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="profile" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({})