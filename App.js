import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from './Shared/Colors';
import Login from './Screens/Login';
import Register from './Screens/Register';
import TabNavigation from './Components/TabNavigation';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Register" component={Register}
          options={{
            headerShown: true, 
            headerTitle: "",
            headerBackTitleVisible: false,
            headerStyle: {backgroundColor: Colors.TRANSPARENT},
          }}
        />
        <Stack.Screen name="Home" component={TabNavigation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
