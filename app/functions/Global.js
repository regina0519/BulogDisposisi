import { Dimensions, StyleSheet } from "react-native";
import { DefaultTheme } from '@react-navigation/native';
class Global {
    static #arrColor = {
        "FUNGSI_001": "#101417",
        "FUNGSI_002": "#783B8D",
        "FUNGSI_003": "#FFA61F",
        "FUNGSI_004": "#002F8B",
        "FUNGSI_005": "#B71F35",
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


    static #userKey = "";
    static #passKey = "";

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
            right: 75,
        },
        backRightBtnRight: {
            //backgroundColor: 'red',
            right: 0,
        }
    });


}
export default Global;
