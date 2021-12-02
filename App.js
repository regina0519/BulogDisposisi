
import React from 'react';
import { useColorScheme } from 'react-native'
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
import ScreenTagihanDetail from './app/screens/ScreenTagihanDetail';
import ScreenItem from './app/screens/ScreenItem';
import ScreenItemAdd from './app/screens/ScreenItemAdd';
import ScreenTagihanEdit from './app/screens/ScreenTagihanEdit';
import ScreenTagihanDetailEdit from './app/screens/ScreenTagihanDetailEdit';
import TestTmp from './app/screens/TestTmp';
import ScreenProfil from './app/screens/ScreenProfil';
import ScreenChangePass from './app/screens/ScreenChangePass';
import ScreenAdmin from './app/screens/ScreenAdmin';
import ScreenAdminBidang from './app/screens/ScreenAdminBidang';
import ScreenAdminBidangEdit from './app/screens/ScreenAdminBidangEdit';
import ScreenAdminJabatan from './app/screens/ScreenAdminJabatan';
import ScreenAdminJabatanEdit from './app/screens/ScreenAdminJabatanEdit';
import ScreenAdminFungsi from './app/screens/ScreenAdminFungsi';
import ScreenAdminFungsiEdit from './app/screens/ScreenAdminFungsiEdit';
import ScreenAdminPegawai from './app/screens/ScreenAdminPegawai';
import ScreenAdminPegawaiEdit from './app/screens/ScreenAdminPegawaiEdit';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal" >
        <Stack.Screen name="Init" component={ScreenInit} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={ScreenLogin} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={ScreenAdmin} />
        <Stack.Screen name="Bidang" component={ScreenAdminBidang} />
        <Stack.Screen name="Edit Bidang" component={ScreenAdminBidangEdit} />
        <Stack.Screen name="Jabatan" component={ScreenAdminJabatan} />
        <Stack.Screen name="Edit Jabatan" component={ScreenAdminJabatanEdit} />
        <Stack.Screen name="Fungsi" component={ScreenAdminFungsi} />
        <Stack.Screen name="Edit Fungsi" component={ScreenAdminFungsiEdit} />
        <Stack.Screen name="Pegawai" component={ScreenAdminPegawai} />
        <Stack.Screen name="Edit Pegawai" component={ScreenAdminPegawaiEdit} />
        <Stack.Screen name="Tagihan" component={ScreenTagihan} />
        <Stack.Screen name="Profil" component={ScreenProfil} />
        <Stack.Screen name="Ganti Password" component={ScreenChangePass} />
        <Stack.Screen name="Edit Tagihan" component={ScreenTagihanEdit} />
        <Stack.Screen name="Detail Tagihan" component={ScreenTagihanDetail} />
        <Stack.Screen name="Edit Detail Tagihan" component={ScreenTagihanDetailEdit} />
        <Stack.Screen name="Item" component={ScreenItem} />
        <Stack.Screen name="Tambah Item" component={ScreenItemAdd} />
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


