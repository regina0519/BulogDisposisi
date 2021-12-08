import Constants from 'expo-constants';
import { Dimensions, StyleSheet } from "react-native";
import { DefaultTheme } from '@react-navigation/native';
import MyServerSettings from "./MyServerSettings";
import * as Notifications from 'expo-notifications';
class Global {
    static #arrColor = {
        "FUNGSI_001": "#101417",
        "FUNGSI_002": "#783B8D",
        "FUNGSI_003": "#FFA61F",
        "FUNGSI_004": "#002F8B",
        "FUNGSI_005": "#8F5902",
        "FUNGSI_006": "#268059"
    };
    static #curUserId = "";
    static #idJab = "";
    static #nmPeg = "";
    static #tipeUser = "";
    static #aktif = false;
    static #idBidang = "";
    static #idFungsi = "";
    static #nmJab = "";
    static #singkJab = "";
    static #isKabid = false;
    static #fungsi = "";
    static #ketFungsi = "";
    static #nmBidang = "";
    static #kdBidang = "";


    static #userKey = "";
    static #passKey = "";

    static #expoPushToken;

    static getScreenWidth() {
        return Dimensions.get('window').width;
    }

    static getCurUserId() {
        return this.#curUserId;
    }
    static setCurUserId(id) {
        this.#curUserId = id;
    }

    static getUserKey() {
        return this.#userKey;
    }
    static setUserKey(uKey) {
        this.#userKey = uKey;
    }

    static getPassKey() {
        return this.#passKey;
    }
    static setPassKey(pKey) {
        this.#passKey = pKey;
    }



    static getIdJab() {
        return this.#idJab;
    }
    static getNmPeg() {
        return this.#nmPeg;
    }
    static getTipeUser() {
        return this.#tipeUser;
    }
    static getAktif() {
        return this.#aktif;
    }
    static getIdBidang() {
        return this.#idBidang;
    }
    static getKodeBidang() {
        return this.#kdBidang;
    }
    static getIdFungsi() {
        return this.#idFungsi;
    }
    static getNmJab() {
        return this.#nmJab;
    }
    static getSingkJab() {
        return this.#singkJab;
    }
    static getIsKabid() {
        return this.#isKabid;
    }
    static getFungsi() {
        return this.#fungsi;
    }
    static getKetFungsi() {
        return this.#ketFungsi;
    }
    static getNmBidang() {
        return this.#nmBidang;
    }
    static getFungsiColor(idFungsi) {
        return this.#arrColor[idFungsi];
    }

    static setUser(data) {
        this.#curUserId = data['id_pegawai'];
        this.#idJab = data['id_jab'];
        this.#nmPeg = data['nm_pegawai'];
        this.#tipeUser = data['tipe_user'];
        this.#aktif = data['aktif'];
        this.#idBidang = data['id_bidang'];
        this.#idFungsi = data['id_fungsi'];
        this.#nmJab = data['nm_jab'];
        this.#singkJab = data['singk_jab'];
        this.#isKabid = data['adalah_kepala_bidang'];
        this.#fungsi = data['fungsi_disposisi'];
        this.#ketFungsi = data['ket_fungsi'];
        this.#nmBidang = data['nm_bidang'];
        this.#kdBidang = data['kode_bidang'];
    }

    static doBackground() {
        Global.loadNotif();
    }

    static loadNotif = () => {
        if (Global.#expoPushToken == null) return;
        let url = MyServerSettings.getPhp("get_list_notif_new.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                let res = responseJson;
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        //console.log("NEW NOTIF: " + res[0]["notif_desc"]);
                        res[0]["sent"] = "1";
                        let f = async () => {
                            await Global.sendPushNotification(Global.#expoPushToken, res[0]["notif_title"], res[0]["notif_desc"], null);
                        }
                        f();
                    }
                    Global.saveNotif(res);
                }
            })
            .catch((error) => {
                console.log('Get Notif New Failed: ' + error)
            });
    }

    static saveNotif = (arr) => {
        //console.log("[" + JSON.stringify(arr) + "]");
        fetch(
            MyServerSettings.getPhp("post_notif_sent.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arr),
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {

            })
            .catch((error) => {
                console.log('Error saving new notif: ' + error)
            });

    }

    static setNotif = () => {
        Notifications.setNotificationHandler({
            handleNotification: async () => {

                return {
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }
            },

        });
        Global.registerForPushNotificationsAsync()
            .then(token => {
                Global.#expoPushToken = token;
            })
            .catch((error) => {
                console.log('Error Token: ' + error)
            });
    }

    static registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
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
    static sendPushNotification = async (expoPushToken, title, body, data) => {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: title,
            body: body,
            data: { someData: 'goes here' },
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






    static customStyles = StyleSheet.create({
        BGImage: {
            resizeMode: 'cover',
            justifyContent: 'center',
        },
        ListItem: {
            borderRadius: 5,
            margin: 2,
            padding: 5,
            elevation: 3,
            backgroundColor: DefaultTheme.colors.background
        },
        Input: {
            width: '100%',
            paddingVertical: 2,
            paddingHorizontal: 10,
            backgroundColor: DefaultTheme.colors.background,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: '#a8a8a8',
            marginBottom: 10,
        },
        Label: {
            color: '#484848',
            fontWeight: 'bold'
        },
        PickerContainer: {
            borderRadius: 25,
            borderWidth: 2,
            padding: 5,
            flexDirection: 'column',
            maxHeight: 35,

        },
        rowBack: {
            alignItems: 'center',
            //backgroundColor: '#DDD',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 15,
        },
        backRightBtn: {
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: 75,
        },
        backRightBtnLeft: {
            //backgroundColor: 'blue',
            left: 0
        },
        backRightBtnRight: {
            //backgroundColor: 'red',
            right: 0,
        }
    });


}
export default Global;
