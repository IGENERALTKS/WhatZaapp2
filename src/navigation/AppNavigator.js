import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../components/Auth/Login';
import Usuario from '../components/Auth/Usuario';
import ChatScreen from '../components/chat/ChatScreen';
import Dashboard from '../components/Dashboard/Dashboard';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Usuario" component={Usuario} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
