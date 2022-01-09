import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import MyServerSettings from './MyServerSettings';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_FETCH_TASK = 'background-fetch';
class BackgroundProcess {
    constructor() {
        //console.log("Test");
        //this.loadData();
        
        TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
            //console.log("BG Trying");
            this.loadData();
            //this.postLog();
            return BackgroundFetch.BackgroundFetchResult.NewData;
        });
        this.registerBackgroundFetchAsync();
    }
    registerBackgroundFetchAsync = async () => {
        return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 60 * 3, // 
            stopOnTerminate: false, // android only,
            startOnBoot: true, // android only
        });
    }
    checkStatusAsync = async () => {
        const status = await BackgroundFetch.getStatusAsync();
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
        return { "status": status, "isRegistered": isRegistered };
    };

    postLog = () => {
        
        fetch(MyServerSettings.getPhp("post_log2.php"))
          .then((response) => response.json())
          .then((responseJson) => {
            this.loadData();
          })
          .catch((error) => {
            
          });
      }

    loadData = () => {
        
        fetch(MyServerSettings.getPhp("get_app_settings.php"))
          .then((response) => response.json())
          .then((responseJson) => {
            let usrKey=responseJson[0]['app_user_key'];
            let passKey=responseJson[0]['app_pass_key'];
            if(usrKey!="" && passKey!=""){
                //console.log(usrKey+"    "+passKey);
                this.readUser(usrKey,passKey);
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
            this.readPass(user,passKey);
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
                this.login(user,pass);
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
            this.setNotif(myId);
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
        this.registerForPushNotificationsAsync()
            .then(token => {
                this.loadNotif(token,idUser);
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
                        this.saveNotif(res[i]["id_notifikasi"]);
                        /*Notifications.addNotificationResponseReceivedListener(response => {
                            var data = response["notification"]["request"]["content"]["data"];
                            //Global.#notifParam["navigation"].navigate('Disposisi Tagihan', { idTagihan: data["idTagihan"] })
                        });*/
                        let f = async () => {
                            await this.sendPushNotification(token, res[i]["notif_title"], res[i]["notif_desc"], { idTagihan: res[i]["id_tagihan"] });
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



    //===========================================================================


    
}
export default BackgroundProcess;