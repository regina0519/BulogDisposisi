
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenTagihan from './ScreenTagihan';
import TestNotif from './TestNotif';



const Tab = createBottomTabNavigator();


export default function ScreenMain() {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#000000',
            }}
        >
            <Tab.Screen
                name="TabTagihan"
                component={ScreenTagihan}
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
                component={TestNotif}
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
    );

}


