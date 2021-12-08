
class CurrentDisposisi {
    #row;
    #fungsi;
    #nmFungsi;
    #first;
    #last;
    #next;
    #prev;

    constructor() { }

    getRow() {
        return this.#row;
    }
    getFungsi() {
        return this.#fungsi;
    }
    getNmFungsi() {
        return this.#nmFungsi;
    }
    getNext() {
        return this.#next;
    }
    getPrev() {
        return this.#prev;
    }
    getFirst() {
        return this.#first;
    }
    getLast() {
        return this.#last;
    }
    findMe(idFungsi) {
        let tmp = this.#first;
        if (tmp == null) return null;
        while (tmp.#next != null) {
            if (tmp.#fungsi == idFungsi) break;
            tmp = tmp.#next;
        }
        return tmp;
    }
    hadReverse() {
        let ret = false;
        let tmp = this.#first;
        while (tmp.#next != null) {
            if (tmp.#row["status"] > 2) {
                ret = true;
                break;
            }
            tmp = tmp.#next;
        }
        return ret;
    }

    fillData(data) {
        this.#first = this;
        this.#fungsi = "FUNGSI_001";
        this.#nmFungsi = "Pembuat Tagihan";
        this.#row = {
            "id": data["id_pembuat"],
            "nm": data["nm_pembuat"],
            "jab": data["jab_pembuat"],
            "cat": data["cat_pembuat"],
            "tgl": data["tgl_pembuatan"],
            "status": data["status_pembuatan"],
            "data_ok": data["kesesuaian_data"],
            "hitung_ok": data["kesesuaian_perhitungan"]
        };
        this.#prev = null;

        this.#next = new CurrentDisposisi();
        this.#next.#first = this.#first;
        var cur = this.#next;
        cur.#fungsi = "FUNGSI_002";
        cur.#nmFungsi = "Pengaju Tagihan";
        cur.#row = {
            "id": data["id_pengaju"],
            "nm": data["nm_pengaju"],
            "jab": data["jab_pengaju"],
            "cat": data["cat_pengaju"],
            "tgl": data["tgl_pengajuan"],
            "status": data["status_pengajuan"],
            "data_ok": data["kesesuaian_data"],
            "hitung_ok": data["kesesuaian_perhitungan"]
        };
        cur.#prev = this;

        cur.#next = new CurrentDisposisi();
        var prev = cur;
        cur.#next.#first = cur.#first;
        cur = cur.#next;
        cur.#fungsi = "FUNGSI_003";
        cur.#nmFungsi = "Kakanwil";
        cur.#row = {
            "id": data["id_kakanwil"],
            "nm": data["nm_kakanwil"],
            "jab": data["jab_kakanwil"],
            "cat": data["cat_kakanwil"],
            "tgl": data["tgl_disposisi_kakanwil"],
            "status": data["status_approval_kakanwil"],
            "data_ok": data["kesesuaian_data"],
            "hitung_ok": data["kesesuaian_perhitungan"]
        };
        cur.#prev = prev;

        cur.#next = new CurrentDisposisi();
        prev = cur;
        cur.#next.#first = cur.#first;
        cur = cur.#next;
        cur.#fungsi = "FUNGSI_004";
        cur.#nmFungsi = "Admin Keuangan";
        cur.#row = {
            "id": data["id_minkeu"],
            "nm": data["nm_minkeu"],
            "jab": data["jab_minkeu"],
            "cat": data["cat_minkeu"],
            "tgl": data["tgl_disposisi_minkeu"],
            "status": data["status_approval_minkeu"],
            "data_ok": data["kesesuaian_data"],
            "hitung_ok": data["kesesuaian_perhitungan"]
        };
        cur.#prev = prev;

        cur.#next = new CurrentDisposisi();
        prev = cur;
        cur.#next.#first = cur.#first;
        cur = cur.#next;
        cur.#fungsi = "FUNGSI_005";
        cur.#nmFungsi = "Verifikator";
        cur.#row = {
            "id": data["id_verifikator"],
            "nm": data["nm_verifikator"],
            "jab": data["jab_verifikator"],
            "cat": data["cat_verifikator"],
            "tgl": data["tgl_verifikasi"],
            "status": data["status_verifikasi"],
            "data_ok": data["kesesuaian_data"],
            "hitung_ok": data["kesesuaian_perhitungan"]
        };
        cur.#prev = prev;

        cur.#next = new CurrentDisposisi();
        prev = cur;
        cur.#next.#first = cur.#first;
        cur = cur.#next;
        cur.#fungsi = "FUNGSI_006";
        cur.#nmFungsi = "Bag. Keuangan";
        cur.#row = {
            "id": data["id_bag_keu"],
            "nm": data["nm_bag_keu"],
            "jab": data["jab_bag_keu"],
            "cat": data["cat_bag_keu"],
            "tgl": data["tgl_bayar"],
            "status": data["status_approval_bagkeu"],
            "data_ok": data["kesesuaian_data"],
            "hitung_ok": data["kesesuaian_perhitungan"]
        };
        cur.#prev = prev;
        cur.#next = null;
        cur.#last = cur;

        while (cur.#prev != null) {
            cur.#prev.#last = cur.#last;
            cur = cur.#prev;
        }
    }


}
export default CurrentDisposisi;