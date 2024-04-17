import { StyleSheet, Text, View, Pressable, Modal } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../Shared/Colors'
import Home from '../Screens/Home'
import Search from '../Screens/Search'
import Gallery from '../Screens/Gallery'
import Spin from '../Screens/Spin'
// import CameraScreen from '../Screens/CameraScreen';
// import CameraService from '../Services/CameraService';


export default function TabNavigation() {
    const Tab = createBottomTabNavigator()
    const [showCamera, setShowCamera] = useState(false);

    // const CustomTabBarButton = ({ children }) => (
    //     <Pressable
    //         style={{
    //             top: -30,
    //             shadowColor: '#7F5DF0',
    //             shadowOffset: {
    //                 width: 0,
    //                 height: 10,
    //             },
    //             shadowOpacity: 0.25,
    //             shadowRadius: 3.5,
    //             elevation: 5,
    //             backgroundColor: '#ffffff', 
    //             borderRadius: 35,
    //             width: 70,
    //             height: 70,
    //         }}
    //         onPress={() => setShowCamera(true)}>
    //         <View style={{
    //             width: 70,
    //             height: 70,
    //             paddingTop: 10,
    //             borderRadius: 35,
    //             backgroundColor: '#ffffff'
    //         }}>
    //             {children}
    //         </View>
    //     </Pressable>
    // )

    //  const toggleCamera = () => {
    //     setShowCamera(!showCamera);
    //  }

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
                    height: 90,
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
                            // <MaterialCommunityIcons name="lightbulb-on-outline" size={size} color={color} />
                            <MaterialCommunityIcons name="ferris-wheel" size={size} color={color} />
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
                {/* <Tab.Screen name="Camera" component={CameraScreen}
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
                /> */}
                <Tab.Screen name="Gallery" component={Gallery}
                    options={{
                        tabBarLabel: ({ focused }) => (focused ? <Text style={styles.title}>GALLERY</Text> : null),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="photo" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
            {/* <Modal
                visible={showCamera}
                animationType="slide"
                transparent={true}
            >
                <CameraScreen
                    showCamera={showCamera}
                    onCancel={() => setShowCamera(false)}
                    type={'gallery'} // Assume 'gallery' type for demonstration
                    onImageCaptured={(imageUri) => {
                        CameraService.handleImageCaptured(imageUri, 'gallery');
                        // Here you would handle the captured image URI, such as uploading it
                        setShowCamera(false);
                    }}
                />
            </Modal>
            <CameraScreen
                showCamera={showCamera}
                onCancel={toggleCamera}
                onImageCaptured={(imageUri) => CameraService.handleImageCaptured(imageUri)}
                type={'avatar'} /> */}
        </>
    )
}

const styles = StyleSheet.create({
    title: { 
        color: Colors.TEXT_COLOR 
    },
});