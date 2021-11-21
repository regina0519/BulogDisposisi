
import React from 'react';
import TestListScreen from './app/screens/TestListScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, createStackNavigator } from '@react-navigation/native-stack';
import TestDetail from './app/screens/TestDetail';
import TestPDF from './app/screens/TestPDF';
import TestNotif from './app/screens/TestNotif';
import TestNotifScreen from './app/screens/TestNotifScreen';
import TestService from './app/screens/TestService';

import ScreenTagihan from './app/screens/ScreenTagihan';
import ScreenInit from './app/screens/ScreenInit';
import ScreenLogin from './app/screens/ScreenLogin';
import ScreenMain from './app/screens/ScreenMain';
import ScreenTagihanAdd from './app/screens/ScreenTagihanAdd';
import ScreenTagihanDetailAdd from './app/screens/ScreenTagihanDetailAdd';
import ScreenTagihanDetail from './app/screens/ScreenTagihanDetail';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal" >
        <Stack.Screen name="Init" component={ScreenInit} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={ScreenLogin} options={{ headerShown: false }} />
        <Stack.Screen name="Tagihan" component={ScreenTagihan} />
        <Stack.Screen name="Tambah Tagihan" component={ScreenTagihanAdd} />
        <Stack.Screen name="Detail Tagihan" component={ScreenTagihanDetail} />
        <Stack.Screen name="Tambah Detail Tagihan" component={ScreenTagihanDetailAdd} />
        <Stack.Screen name="Home" component={ScreenMain} />
        <Stack.Screen name="Test List" component={TestListScreen} />
        <Stack.Screen name="Detail" component={TestDetail} />
        <Stack.Screen name="Test PDF" component={TestPDF} />
        <Stack.Screen name="Test Notif" component={TestNotif} />
        <Stack.Screen name="Test Notif Screen" component={TestNotifScreen} />
        <Stack.Screen name="Test Service" component={TestService} />
      </Stack.Navigator>

    </NavigationContainer>
  );

}


