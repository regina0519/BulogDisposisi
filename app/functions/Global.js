
class Global {
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


}
export default Global;
