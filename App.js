
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



import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import MyServerSettings from './app/functions/MyServerSettings';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_FETCH_TASK = 'background-fetch';
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  //console.log("BG Trying");
  loadData();
  //this.postLog();
  return BackgroundFetch.BackgroundFetchResult.NewData;
});


registerBackgroundFetchAsync = async () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60, // 
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
  });
}
checkStatusAsync = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  return { "status": status, "isRegistered": isRegistered };
};


loadData = () => {
  
  fetch(MyServerSettings.getPhp("get_app_settings.php"))
    .then((response) => response.json())
    .then((responseJson) => {
      let usrKey=responseJson[0]['app_user_key'];
      let passKey=responseJson[0]['app_pass_key'];
      if(usrKey!="" && passKey!=""){
          //console.log(usrKey+"    "+passKey);
          readUser(usrKey,passKey);
      }
    })
    .catch((error) => {
      
    });
}

readUser = async (usrKey,passKey) => {
  try {
    const value = await AsyncStorage.getItem(usrKey);
    if (value !== null) {
      let user=value;
      //console.log(user);
      readPass(user,passKey);
    }
  } catch (e) {
    
  }
}
readPass = async (user,passKey) => {
  try {
    const value = await AsyncStorage.getItem(passKey);
    if (value !== null) {
      let pass=value;
      //console.log(pass);
      if(user!="" && pass!=""){
          login(user,pass);
      }
    } 
  } catch (e) {
      
  }
}

login = (user,pass) => {
  
  fetch(
    MyServerSettings.getPhp("get_login_info.php"),
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user": user,
        "pass": pass
      }),
    }
  )
    .then((response) => response.json())
    .then((responseJson) => {
      let myId=responseJson[0]["id_pegawai"];
      //Process Notif
      //console.log(myId);
      setNotif(myId);
    })
    .catch((error) => {
      
    });
}

setNotif = (idUser) => {
    //console.log("set notif");
  Notifications.setNotificationHandler({
      handleNotification: async () => {

          return {
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
          }
      },

  });
  registerForPushNotificationsAsync()
      .then(token => {
          loadNotif(token,idUser);
      })
      .catch((error) => {
          //console.log('Error Token: ' + error)
      });
}

loadNotif = (token, id) => {
  if (token == null) return;
  let url = MyServerSettings.getPhp("get_list_notif_new.php") + "?id=" + id;
  fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
          let res = responseJson;
          if (res.length > 0) {
              var l = [];
              for (var i = 0; i < res.length; i++) {
                  //res[i]["sent"] = "1";
                  //console.log(res[i]["id_notifikasi"]);
                  saveNotif(res[i]["id_notifikasi"]);
                  /*Notifications.addNotificationResponseReceivedListener(response => {
                      var data = response["notification"]["request"]["content"]["data"];
                      //Global.#notifParam["navigation"].navigate('Disposisi Tagihan', { idTagihan: data["idTagihan"] })
                  });*/
                  let f = async () => {
                      await sendPushNotification(token, res[i]["notif_title"], res[i]["notif_desc"], { idTagihan: res[i]["id_tagihan"] });
                  }
                  f();

              }

          }
      })
      .catch((error) => {
          //console.log('Get Notif New Failed: ' + error)
      });

}

saveNotif = (id) => {

  fetch(
      MyServerSettings.getPhp("post_notif_sent.php") + "?id=" + id
  )
      .then((response) => response.json())
      .then((responseJson) => {

      })
      .catch((error) => {
          console.log('Error saving new notif: ' + error)
      });

}

sendPushNotification = async (expoPushToken, title, body, data) => {
  //console.log("BG Completed");
  const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
  });
}


registerForPushNotificationsAsync = async () => {
  //console.log("reg");
  let token;
  if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
      }
      if (finalStatus !== 'granted') {
          MyFunctions.msgBox('Failed to get push token for push notification!');
          return;
      }
      token = (await Notifications.getExpoPushTokenAsync({ experienceId: "@18013013regina/BulogDisposisi" })).data;
      //console.log(token);
  } else {
      MyFunctions.msgBox('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
      });
  }

  return token;
}





const Stack = createNativeStackNavigator();


export default function App() {
  registerBackgroundFetchAsync();
  //new BackgroundProcess();
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


