import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from './Shared/Colors';
import LoginRegister from './Screens/LoginRegister';
import TabNavigation from './Components/TabNavigation';
import PlaceDetail from './Components/Place/PlaceDetail';

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase-files/FirebaseSetup'

const Stack = createStackNavigator();
// AppRegistry.registerComponent('main', () => App);

export default function App() {
  const [userloggedIn, setUserloggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserloggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  const AuthStack = (
    <Stack.Screen name="LoginRegister" component={LoginRegister} />
  )
  const AppStack = (
    <>
      <Stack.Screen
        name="Back"
        component={TabNavigation} />
      <Stack.Screen name="place-detail"
        component={PlaceDetail}
        screenOptions={{ presentation: 'modal' }}
        options={{
          headerShown: true,
          title: '',
        }} />
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
    backgroundColor: Colors.LIGHT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
