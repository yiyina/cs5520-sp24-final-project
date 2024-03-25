import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from './Shared/Colors';
import Login from './Screens/Login';
import Register from './Screens/Register';
import TabNavigation from './Components/TabNavigation';

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase-files/FirebaseSetup'

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [userloggedIn, setUserloggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserloggedIn(true);
      } else {
        setUserloggedIn(false);
      }
    })
  }, [])

  const AuthStack = (
    <>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register}
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: Colors.TRANSPARENT },
        }}
      />
    </>
  )
  const AppStack = (
    <>
      <Stack.Screen name="Home" component={TabNavigation} />
    </>
  )

  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{ headerShown: false }}
      >
        {userloggedIn ? AppStack : AuthStack}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
