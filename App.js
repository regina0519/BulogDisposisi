
import React from 'react';
import { useColorScheme, Text, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, createStackNavigator } from '@react-navigation/native-stack';

import ScreenTagihan from './app/screens/ScreenTagihan';
import ScreenInit from './app/screens/ScreenInit';
import ScreenLogin from './app/screens/ScreenLogin';
import ScreenMain from './app/screens/ScreenMain';
import ScreenTagihanDetail from './app/screens/ScreenTagihanDetail';
import ScreenItem from './app/screens/ScreenItem';
import ScreenItemAdd from './app/screens/ScreenItemAdd';
import ScreenTagihanEdit from './app/screens/ScreenTagihanEdit';
import ScreenTagihanDetailEdit from './app/screens/ScreenTagihanDetailEdit';
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
import ScreenNotif from './app/screens/ScreenNotif';
import ScreenProgress from './app/screens/ScreenProgress';
import ScreenTagihanAction from './app/screens/ScreenTagihanAction';
import ScreenTagihanCompleted from './app/screens/ScreenTagihanCompleted';
import BackgroundProcess from './app/functions/BackgroundProcess';

const Stack = createNativeStackNavigator();


export default function App() {
  new BackgroundProcess();
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal" >
        <Stack.Screen name="Init" component={ScreenInit} options={{ headerShown: false }} />
        <Stack.Screen name="Masuk" component={ScreenLogin} options={{ headerShown: false }} />
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
        <Stack.Screen name="Riwayat" component={ScreenTagihanCompleted} />
        <Stack.Screen name="Profil" component={ScreenProfil} />
        <Stack.Screen name="Ganti Kata Sandi" component={ScreenChangePass} />
        <Stack.Screen name="Edit Tagihan" component={ScreenTagihanEdit} />
        <Stack.Screen name="Disposisi Tagihan" component={ScreenTagihanAction} />
        <Stack.Screen name="Detail Tagihan" component={ScreenTagihanDetail} />
        <Stack.Screen name="Edit Detail Tagihan" component={ScreenTagihanDetailEdit} />
        <Stack.Screen name="Item" component={ScreenItem} />
        <Stack.Screen name="Tambah Item" component={ScreenItemAdd} />
        <Stack.Screen name="Bulog" component={ScreenMain} />
        <Stack.Screen name="Notifikasi" component={ScreenNotif} />
        <Stack.Screen name="Progres Tagihan" component={ScreenProgress} />

      </Stack.Navigator>

    </NavigationContainer>
  );

}


