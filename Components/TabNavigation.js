import { StyleSheet, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from '../Screens/Home'
import Search from '../Screens/Search'
import Profile from '../Screens/Profile'
import Spin from '../Screens/Spin'
import CameraScreen from '../Screens/CameraScreen';


export default function TabNavigation() {
    const Tab = createBottomTabNavigator()
    const [showCamera, setShowCamera] = useState(false);

    const CustomTabBarButton = ({ children }) => (
        <Pressable
            style={{
                top: -30, // Adjust this to make the button float
                shadowColor: '#7F5DF0', // You can adjust shadow color
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
                elevation: 5,
                backgroundColor: '#ffffff', // Background color of the button
                borderRadius: 35,
                width: 70,
                height: 70,
            }}
            onPress={() => setShowCamera(true)}>
            <View style={{
                width: 70,
                height: 70,
                paddingTop: 10,
                borderRadius: 35,
                backgroundColor: '#ffffff'
            }}>
                {children}
            </View>
        </Pressable>
    )

    // const toggleCamera = () => {
    //     setShowCamera(!showCamera);
    // }

    return (
        <>
            <Tab.Navigator screenOptions={{
                headerShown: false,
                // tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
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
                <Tab.Screen name="Camera" component={CameraScreen}
                    options={{
                        tabBarLabel: '',
                        tabBarIcon: ({ focused }) => (
                            <EvilIcons
                                name="camera"
                                size={50} // 30 when tab is focused, 25 otherwise
                                color={focused ? "#e32f45" : "#748c94"} // specific colors based on focus
                            />
                        ),
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props} />
                        ),
                    }}
                />
                <Tab.Screen name="Spin" component={Spin}
                    options={{
                        tabBarLabel: 'Spin',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={color} />
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
            {/* <CameraScreen
                showCamera={showCamera}
                onCancel={toggleCamera}
                onImageCaptured={(imageUri) => CameraService.handleImageCaptured(imageUri)}
                type={'avatar'} /> */}
        </>
    )
}

const styles = StyleSheet.create({})