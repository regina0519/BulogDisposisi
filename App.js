
import React from 'react';
import MainScreen from './app/screens/MainScreen';
import TestListScreen from './app/screens/TestListScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, createStackNavigator } from '@react-navigation/native-stack';
import TestDetail from './app/screens/TestDetail';
import TestPDF from './app/screens/TestPDF';
import TestNotif from './app/screens/TestNotif';
import TestNotifScreen from './app/screens/TestNotifScreen';
import TestService from './app/screens/TestService';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenTagihan from './app/screens/ScreenTagihan';
import ScreenInit from './app/screens/ScreenInit';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackTagihan() {
  return (
    <Stack.Navigator mode="modal" >
      <Stack.Screen name="Init" component={ScreenInit} options={{ headerShown: false }} />
      <Stack.Screen name="Tagihan" component={ScreenTagihan} />
      <Stack.Screen name="Home" component={MainScreen} />
      <Stack.Screen name="Test List" component={TestListScreen} />
      <Stack.Screen name="Detail" component={TestDetail} />
      <Stack.Screen name="Test PDF" component={TestPDF} />
      <Stack.Screen name="Test Notif" component={TestNotif} />
      <Stack.Screen name="Test Notif Screen" component={TestNotifScreen} />
      <Stack.Screen name="Test Service" component={TestService} />
    </Stack.Navigator>
  );
}

function StackProfil() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        name="StackSettings"
        component={TestNotif} />
      <Stack.Screen
        name="StackDetails"
        component={TestNotifScreen} />
      <Stack.Screen
        name="StackProfile"
        component={TestService} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Feed"
        screenOptions={{
          headerShown: false,
          activeTintColor: '#42f44b',
        }}>
        <Tab.Screen
          name="TabTagihan"
          component={StackTagihan}
          options={{
            tabBarLabel: 'Tagihan',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="view-list"
                color={color}
                size={size}
              />
            ),
          }} />
        <Tab.Screen
          name="TabProfile"
          component={StackProfil}
          options={{
            tabBarLabel: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

}


