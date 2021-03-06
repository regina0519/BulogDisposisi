import moment from 'moment/min/moment-with-locales';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, AppRegistry, BackHandler, ImageBackground, RefreshControl, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrentDisposisi from '../functions/CurrentDisposisi';
import Global from '../functions/Global';
import MyFunctions from '../functions/MyFunctions';
import MyServerSettings from '../functions/MyServerSettings';



const unknownCode = "KU.04.02";
class ScreenTagihanAction extends Component {
    keyExtractor = (data, index) => index + "";
    person = new CurrentDisposisi();
    arrNotif = [];
    deleteAllNotifs = false;

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            idTagihan: props.route.params.idTagihan,
            myData: [],
            myTimer: [],
            myNewNoVeri: [],
            myNewNoBayar: [],
            myResult: [],
            myResultNotif: [],
            actionChosen: "NONE",
            allowSave: false
        }
    }


    render() {

        if (this.state.loading) {
            return (
                <View style={styles.LoadingContainer}>
                    <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                    {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}
                </View>
            );
        }

        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default.jpg')}>
                <View style={styles.MainContainer}>
                    <View style={styles.ContentContainer}>
                        <View style={{ margin: 5 }}>
                            <View style={{ flexDirection: 'row', margin: 2, padding: 2, backgroundColor: "#FFFFFF", elevation: 2, alignSelf: 'center' }}>
                                <View style={{ alignItems: 'center', width: '20%', justifyContent: 'center', borderWidth: 0, borderRadius: 5, backgroundColor: Global.getFungsiColor(this.state.myData["id_fungsi"]) }}>
                                    <View style={{ elevation: 2, borderRadius: 1, width: '100%', padding: 5 }}>
                                        <Text style={{ textAlign: 'center', backgroundColor: '#FF0000', fontWeight: 'bold', color: '#FFFFFF' }}>{moment(this.state.myData["tgl_pembuatan"]).locale("id").format('MMM')}</Text>
                                        <Text style={{ textAlign: 'center', backgroundColor: '#FFFFFF', fontWeight: 'bold', color: '#000000', fontSize: 20 }}>{moment(this.state.myData["tgl_pembuatan"]).locale("id").format('DD')}</Text>
                                        <Text style={{ textAlign: 'center', backgroundColor: '#FFFFFF', fontWeight: 'bold', color: '#000000', fontSize: 10 }}>{moment(this.state.myData["tgl_pembuatan"]).locale("id").format('YYYY')}</Text>
                                    </View>
                                </View>

                                <View style={{ padding: 5, justifyContent: 'center', maxWidth: '80%' }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'left', fontSize: 12, color: Global.getFungsiColor(Global.getIdFungsi()) }}>{this.state.myData["no_nota_intern"]}</Text>
                                    <Text style={{ fontSize: 12 }}>{this.state.myData["ket_tagihan"]}</Text>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{this.state.myData["id_bidang"] == "" ? "" : "Bidang " + this.state.myData["nm_bidang"]}</Text>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'right' }}>Rp. {MyFunctions.formatMoney(this.countTotal())}</Text>

                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                <Text style={{ fontWeight: 'bold', padding: 5, alignSelf: 'center' }}>Status:</Text>
                                <Text style={{ fontWeight: 'bold', padding: 5, paddingHorizontal: 20, alignSelf: 'center', maxWidth: '70%', textAlign: 'center', borderRadius: 25, backgroundColor: this.getCurrentStatus(this.getCurrentStatusPerson(this.person.getFirst()))["color"], color: '#FFFFFF' }}>{this.getCurrentStatus(this.getCurrentStatusPerson(this.person.getFirst()))["msg"]}</Text>
                            </View>
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1 }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'left', fontSize: 12 }}>Rincian:</Text>
                            <SwipeListView
                                data={this.state.myData["det_array"]}
                                renderItem={this.renderDataItem}
                                renderHiddenItem={this.renderHiddenItem}
                                leftOpenValue={0}
                                rightOpenValue={0}
                                previewRowKey={'0'}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                onRowDidOpen={this.onRowDidOpen}
                                keyExtractor={this.keyExtractor}
                                style={{ width: '100%' }}
                                refreshControl={
                                    <RefreshControl refreshing={false} onRefresh={this.refreshData} />
                                }
                            />

                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>
                            {
                                this.renderActionControl()
                            }
                        </View>



                    </View>
                    <View style={styles.LoadingContainer}>
                        <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                        {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}
                    </View>
                    {this.renderAction()}



                </View>
            </ImageBackground>
        )

    }

    renderReject = (person) => {
        var render = true;
        if (person.getRow()["status"] == 0) {
            if (person.getFungsi() == "FUNGSI_001") {
                render = false;
            }
        }
        return render;
    }
    renderRevise = (person) => {
        var render = true;
        if (person.getRow()["status"] == 0) {
            if (person.getFungsi() == "FUNGSI_001") {
                render = false;
            }
        } else if (person.getRow()["status"] == 3) {
            render = false;
        }
        return render;
    }

    renderActionControl = () => {
        let p = this.getCurrentStatusPerson(this.person.getFirst());
        let me = this.person.findMe(Global.getIdFungsi());
        if (me == null) return null;
        if (p !== null) {
            if (p != me) return null;
        }
        if (me.getFungsi() == "FUNGSI_001") {
            if (Global.getIdBidang() != this.state.myData["id_bidang"]) return null;
        } else if (me.getFungsi() == "FUNGSI_002") {
            if (Global.getIdBidang() != this.state.myData["id_bidang"]) return null;
        }
        if (me.getRow()["status"] == 1 || me.getRow()["status"] == 2 || me.getRow()["status"] == 4 || me.getRow()["status"] == 5) {
            return null;
        }
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {
                    this.renderReject(me) ? (
                        <TouchableOpacity onPress={
                            () => {
                                this.setState({
                                    actionChosen: "REJECT"
                                });
                            }
                        } disabled={this.state.loading}>
                            <MaterialCommunityIcons
                                name="close"
                                size={30}
                                color={'#FF0000'}
                            />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Tolak</Text>
                        </TouchableOpacity>
                    ) : (null)
                }
                {
                    this.renderRevise(me) ? (
                        <TouchableOpacity onPress={
                            () => {
                                this.setState({
                                    actionChosen: "REVISE"
                                });
                            }
                        } disabled={this.state.loading}>
                            <MaterialCommunityIcons
                                name="file-edit"
                                size={30}
                                color={'#0000FF'}
                            />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Revisi</Text>
                        </TouchableOpacity>
                    ) : (null)
                }
                <TouchableOpacity onPress={
                    () => {
                        this.setState({
                            actionChosen: "APPROVE"
                        });
                    }
                } disabled={this.state.loading}>
                    <MaterialCommunityIcons
                        name="check"
                        size={30}
                        color={'#00FF00'}
                    />
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Proses</Text>
                </TouchableOpacity>
            </View>
        );
    }


    getCurrentStatus = (person) => {
        var ret = "ERROR";
        var color = "#0000FF";
        if (person == null) return ret;
        if (person.getRow()["status"] == "0") {
            color = "#0000FF";
            if (person.getFungsi() == "FUNGSI_001") {
                ret = "Menunggu diproses oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_002") {
                ret = "Menunggu diajukan oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_003") {
                ret = "Menunggu di-disposisi oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_004") {
                ret = "Menunggu disetujui oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_005") {
                ret = "Menunggu diverifikasi oleh " + person.getNmFungsi();
            } else {
                ret = "Menunggu proses pencairan oleh " + person.getNmFungsi();
            }
        } else if (person.getRow()["status"] == "1") {
            if (person.getFungsi() == "FUNGSI_006") {
                color = "#00FF00";
                ret = "Selesai";
            }
        } else if (person.getRow()["status"] == "2") {
            color = "#FF0000";
            if (person.getFungsi() == "FUNGSI_001") {
                ret = "Dibatalkan oleh " + person.getNmFungsi();
            } else {
                ret = "Ditolak oleh " + person.getNmFungsi();
            }
        } else if (person.getRow()["status"] == "3") {
            if (person.getFungsi() == "FUNGSI_001") {
                ret = "Menunggu revisi oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_002") {
                ret = "Menunggu persetujuan revisi oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_003") {
                ret = "Menunggu persetujuan revisi oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_004") {
                ret = "Menunggu persetujuan revisi oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_005") {
                ret = "Menunggu persetujuan revisi oleh " + person.getNmFungsi();
            }
        } else if (person.getRow()["status"] == "5") {
            color = "#FF0000";
            if (person.getFungsi() == "FUNGSI_001") {
                ret = "Revisi dibatalkan oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_002") {
                ret = "Revisi tidak disetujui oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_003") {
                ret = "Revisi tidak disetujui oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_004") {
                ret = "Revisi tidak disetujui oleh " + person.getNmFungsi();
            } else if (person.getFungsi() == "FUNGSI_005") {
                ret = "Revisi tidak disetujui oleh " + person.getNmFungsi();
            }
        }
        return { "color": color, "msg": ret };
    }

    getCurrentStatusPerson = (firstPerson) => {
        if (firstPerson == null) return null;
        if (firstPerson.getRow()["status"] == 0) {
            return firstPerson;
        } else if (firstPerson.getRow()["status"] == 1) {
            if (firstPerson.getNext() != null) {
                return this.getCurrentStatusPerson(firstPerson.getNext());
            } else return firstPerson;
        } else if (firstPerson.getRow()["status"] == 2) {
            return firstPerson;
        } else if (firstPerson.getRow()["status"] == 3) {
            if (firstPerson.getNext() != null) {
                if (firstPerson.getNext().getRow()["status"] == 3) {
                    return this.getCurrentStatusPerson(firstPerson.getNext());
                } else if (firstPerson.getNext().getRow()["status"] == 4) {
                    return firstPerson;
                } else if (firstPerson.getNext().getRow()["status"] == 5) {
                    return firstPerson.getNext();
                } else {
                    return null;
                }
            } else return null;
        } else if (firstPerson.getRow()["status"] == 5) {
            return firstPerson;
        } else return null;
    }


    renderAction = () => {
        if (this.state.actionChosen == "NONE") return null;
        return (
            <View style={[styles.LoadingContainer, { padding: 20, borderRadius: 10, backgroundColor: '#EEEEEE', borderWidth: 1, height: 'auto', bottom: 0, elevation: 3 }]}>
                {
                    Global.getIdFungsi() == "FUNGSI_005" ? (
                        <View>
                            <Text style={Global.customStyles.Label}>Nomor Verifikasi</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginHorizontal: 10 }}>
                                <TextInput
                                    value={this.extractNoVeri(this.state.myData["no_verifikasi"])}
                                    multiline={false}
                                    onChangeText={(no_verifikasi) => {
                                        no_verifikasi = MyFunctions.validateInputNumbersOnly(no_verifikasi);
                                        let arr = this.state.myData;
                                        arr['no_verifikasi'] = this.injectNoVeri(this.state.myData['no_verifikasi'], no_verifikasi);
                                        this.setState({ myData: arr });
                                    }}
                                    placeholder={'Nomor Verifikasi'}
                                    keyboardType="numeric"
                                    numeric
                                    style={[Global.customStyles.Input, { width: 80, marginBottom: 0 }]}
                                />
                                <Text style={Global.customStyles.Label}> {this.extractNoVeriLast(this.state.myData["no_verifikasi"])}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Kesesuaian Data</Text>
                                <Switch
                                    trackColor={{ false: '#a8a8a8', true: '#a8a8a8' }}
                                    thumbColor={this.state.myData["kesesuaian_data"] == 1 ? '#000000' : '#989898'}
                                    onValueChange={() => {
                                        var b = this.state.myData["kesesuaian_data"] == 1;
                                        b = !b;
                                        let arr = this.state.myData;
                                        arr['kesesuaian_data'] = b ? "1" : "0";
                                        this.setState({ myData: arr });
                                    }}
                                    value={this.state.myData["kesesuaian_data"] == 1}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Kesesuaian Perhitungan</Text>
                                <Switch
                                    trackColor={{ false: '#a8a8a8', true: '#a8a8a8' }}
                                    thumbColor={this.state.myData["kesesuaian_perhitungan"] == 1 ? '#000000' : '#989898'}
                                    onValueChange={() => {
                                        var b = this.state.myData["kesesuaian_perhitungan"] == 1;
                                        b = !b;
                                        let arr = this.state.myData;
                                        arr['kesesuaian_perhitungan'] = b ? "1" : "0";
                                        this.setState({ myData: arr });
                                    }}
                                    value={this.state.myData["kesesuaian_perhitungan"] == 1}
                                />
                            </View>
                        </View>
                    ) : (null)
                }
                {
                    Global.getIdFungsi() == "FUNGSI_006" ? (
                        <View>
                            <Text style={Global.customStyles.Label}>Nomor Bukti Pembayaran</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginHorizontal: 10 }}>
                                <TextInput
                                    value={this.extractNoBayar(this.state.myData["no_bukti_pembayaran"])}
                                    multiline={false}
                                    onChangeText={(no_bukti_pembayaran) => {
                                        no_bukti_pembayaran = MyFunctions.validateInputNumbersOnly(no_bukti_pembayaran);
                                        let arr = this.state.myData;
                                        arr['no_bukti_pembayaran'] = this.injectNoBayar(this.state.myData['no_bukti_pembayaran'], no_bukti_pembayaran);
                                        this.setState({ myData: arr });
                                    }}
                                    placeholder={'Nomor Bukti Pembayaran'}
                                    keyboardType="numeric"
                                    numeric
                                    style={[Global.customStyles.Input, { width: 80, marginBottom: 0 }]}
                                />
                                <Text style={Global.customStyles.Label}> {this.extractNoBayarLast(this.state.myData["no_bukti_pembayaran"])}</Text>
                            </View>
                        </View>
                    ) : (null)
                }





                <Text style={Global.customStyles.Label}>Catatan</Text>
                <TextInput
                    value={
                        Global.getIdFungsi() == "FUNGSI_001" ? (
                            this.state.myData["cat_pembuat"]
                        ) : (
                            Global.getIdFungsi() == "FUNGSI_002" ? (
                                this.state.myData["cat_pengaju"]
                            ) : (
                                Global.getIdFungsi() == "FUNGSI_003" ? (
                                    this.state.myData["cat_kakanwil"]
                                ) : (
                                    Global.getIdFungsi() == "FUNGSI_004" ? (
                                        this.state.myData["cat_minkeu"]
                                    ) : (
                                        Global.getIdFungsi() == "FUNGSI_005" ? (
                                            this.state.myData["cat_verifikator"]
                                        ) : (
                                            this.state.myData["cat_bag_keu"]
                                        )
                                    )
                                )
                            )
                        )
                    }
                    multiline={true}
                    onChangeText={(cat) => {
                        cat = MyFunctions.validateString(cat);
                        let arr = this.state.myData;
                        arr[
                            Global.getIdFungsi() == "FUNGSI_001" ? (
                                "cat_pembuat"
                            ) : (
                                Global.getIdFungsi() == "FUNGSI_002" ? (
                                    "cat_pengaju"
                                ) : (
                                    Global.getIdFungsi() == "FUNGSI_003" ? (
                                        "cat_kakanwil"
                                    ) : (
                                        Global.getIdFungsi() == "FUNGSI_004" ? (
                                            "cat_minkeu"
                                        ) : (
                                            Global.getIdFungsi() == "FUNGSI_005" ? (
                                                "cat_verifikator"
                                            ) : (
                                                "cat_bag_keu"
                                            )
                                        )
                                    )
                                )
                            )
                        ] = cat;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Catatan'}
                    style={Global.customStyles.Input}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={
                        () => {
                            this.setState({ actionChosen: "NONE" });
                        }
                    } disabled={this.state.loading}>
                        <MaterialCommunityIcons
                            name="cancel"
                            size={30}
                            color={'#FF0000'}
                        />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setSaveAction()} disabled={this.disableActionOk()}>
                        <MaterialCommunityIcons
                            name="check"
                            size={30}
                            color={this.disableActionOk() ? '#AAAAAA' : '#00FF00'}
                        />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Ok</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    disableActionOk = () => {
        var val = "";
        if (Global.getIdFungsi() == "FUNGSI_001") {
            val = this.state.myData["cat_pembuat"];
        } else if (Global.getIdFungsi() == "FUNGSI_002") {
            val = this.state.myData["cat_pengaju"];
        } else if (Global.getIdFungsi() == "FUNGSI_003") {
            val = this.state.myData["cat_kakanwil"];
        } else if (Global.getIdFungsi() == "FUNGSI_004") {
            val = this.state.myData["cat_minkeu"];
        } else if (Global.getIdFungsi() == "FUNGSI_005") {
            val = this.state.myData["cat_verifikator"];
        } else {
            val = this.state.myData["cat_bag_keu"];
        }
        var veriOk = true;
        if (Global.getIdFungsi() == "FUNGSI_005") {
            if (this.state.actionChosen == "APPROVE") {
                veriOk = (this.state.myData["kesesuaian_data"] == "1") && (this.state.myData["kesesuaian_perhitungan"] == "1") && (this.state.myData["no_verifikasi"] != "");
            }
        }
        var bayarOk = true;
        if (Global.getIdFungsi() == "FUNGSI_006") {
            if (this.state.actionChosen == "APPROVE") {
                bayarOk = (this.state.myData["no_bukti_pembayaran"] != "");
            }
        }
        return !(val != "" && veriOk && !this.state.loading && bayarOk);
    }

    getIdByFungsi = (fungsi, arr) => {
        if (fungsi == "FUNGSI_001") {
            return arr["id_pembuat"];
        }
        if (fungsi == "FUNGSI_002") {
            return arr["id_pengaju"];
        }
        if (fungsi == "FUNGSI_003") {
            return arr["id_kakanwil"];
        }
        if (fungsi == "FUNGSI_004") {
            return arr["id_minkeu"];
        }
        if (fungsi == "FUNGSI_005") {
            return arr["id_verifikator"];
        }
        return arr["id_bag_keu"];
    }

    getNmByFungsi = (fungsi, arr) => {
        if (fungsi == "FUNGSI_001") {
            return arr["nm_pembuat"];
        }
        if (fungsi == "FUNGSI_002") {
            return arr["nm_pengaju"];
        }
        if (fungsi == "FUNGSI_003") {
            return arr["nm_kakanwil"];
        }
        if (fungsi == "FUNGSI_004") {
            return arr["nm_minkeu"];
        }
        if (fungsi == "FUNGSI_005") {
            return arr["nm_verifikator"];
        }
        return arr["nm_bag_keu"];
    }

    getProsesByFungsi = (fungsi) => {
        if (fungsi == "FUNGSI_001") {
            return "diproses";
        }
        if (fungsi == "FUNGSI_002") {
            return "diajukan";
        }
        if (fungsi == "FUNGSI_003") {
            return "disetujui";
        }
        if (fungsi == "FUNGSI_004") {
            return "diproses";
        }
        if (fungsi == "FUNGSI_005") {
            return "diverifikasi";
        }
        return "disetujui bayar";
    }

    getCatByFungsi = (fungsi, arr) => {
        if (fungsi == "FUNGSI_001") {
            return arr["cat_pembuat"];
        }
        if (fungsi == "FUNGSI_002") {
            return arr["cat_pengaju"];
        }
        if (fungsi == "FUNGSI_003") {
            return arr["cat_kakanwil"];
        }
        if (fungsi == "FUNGSI_004") {
            return arr["cat_minkeu"];
        }
        if (fungsi == "FUNGSI_005") {
            return arr["cat_verifikator"];
        }
        return arr["cat_bag_keu"];
    }
    getStatusByFungsi = (fungsi, arr) => {
        if (fungsi == "FUNGSI_001") {
            return arr["status_pembuatan"];
        }
        if (fungsi == "FUNGSI_002") {
            return arr["status_pengajuan"];
        }
        if (fungsi == "FUNGSI_003") {
            return arr["status_approval_kakanwil"];
        }
        if (fungsi == "FUNGSI_004") {
            return arr["status_approval_minkeu"];
        }
        if (fungsi == "FUNGSI_005") {
            return arr["status_verifikasi"];
        }
        return arr["status_approval_bagkeu"];
    }

    setSaveAction = () => {
        let me = this.person.findMe(Global.getIdFungsi());
        let arr = this.state.myData;
        if (arr.length == 0) return;
        if (me == null) return;
        let id = "id_pembuat";
        let nm = "nm_pembuat";
        let jab = "jab_pembuat";
        let cat = "cat_pembuat";
        let tgl = "tgl_pembuatan";
        let status = "status_pembuatan";



        if (me.getFungsi() == "FUNGSI_001") {
            id = "id_pembuat";
            nm = "nm_pembuat";
            jab = "jab_pembuat";
            cat = "cat_pembuat";
            tgl = "tgl_pembuatan";
            status = "status_pembuatan";
        } else if (me.getFungsi() == "FUNGSI_002") {
            id = "id_pengaju";
            nm = "nm_pengaju";
            jab = "jab_pengaju";
            cat = "cat_pengaju";
            tgl = "tgl_pengajuan";
            status = "status_pengajuan";
        } else if (me.getFungsi() == "FUNGSI_003") {
            id = "id_kakanwil";
            nm = "nm_kakanwil";
            jab = "jab_kakanwil";
            cat = "cat_kakanwil";
            tgl = "tgl_disposisi_kakanwil";
            status = "status_approval_kakanwil";
        } else if (me.getFungsi() == "FUNGSI_004") {
            id = "id_minkeu";
            nm = "nm_minkeu";
            jab = "jab_minkeu";
            cat = "cat_minkeu";
            tgl = "tgl_disposisi_minkeu";
            status = "status_approval_minkeu";
        } else if (me.getFungsi() == "FUNGSI_005") {
            id = "id_verifikator";
            nm = "nm_verifikator";
            jab = "jab_verifikator";
            cat = "cat_verifikator";
            tgl = "tgl_verifikasi";
            status = "status_verifikasi";
        } else {
            id = "id_bag_keu";
            nm = "nm_bag_keu";
            jab = "jab_bag_keu";
            cat = "cat_bag_keu";
            tgl = "tgl_bayar";
            status = "status_approval_bagkeu";
        }
        if (me.getFungsi() != "FUNGSI_001") {
            arr[id] = Global.getCurUserId();
            arr[nm] = Global.getNmPeg();
            arr[jab] = Global.getNmJab();
            arr[tgl] = this.state.myTimer["now"];
        }
        if (this.state.actionChosen == "APPROVE") {
            if (me.getRow()["status"] == 0) {
                arr[status] = "1";
                if (me.getFungsi() == "FUNGSI_006") {
                    arr["status_tagihan"] = "COMPLETED";
                    this.deleteAllNotifs = true;
                    let wlk = me;
                    while (wlk.getPrev() != null) {
                        wlk = wlk.getPrev();
                        let arrTmp = {
                            "id_notifikasi": "",
                            "id_pegawai": this.getIdByFungsi(wlk.getFungsi(), arr),
                            "id_tagihan": arr["id_tagihan"],
                            "notif_title": "Tagihan selesai",
                            "notif_desc":
                                arr["no_nota_intern"]
                                + " telah selesai diproses.",
                            "sent": "0",
                            "tgl_kirim": this.state.myTimer["now"],
                            "seen": "0"
                        };
                        this.arrNotif.push(arrTmp);

                    }
                } else {
                    let wlk = me;
                    while (wlk.getPrev() != null) {
                        wlk = wlk.getPrev();
                        let arrTmp = {
                            "id_notifikasi": "",
                            "id_pegawai": this.getIdByFungsi(wlk.getFungsi(), arr),
                            "id_tagihan": arr["id_tagihan"],
                            "notif_title": "Progres Tagihan",
                            "notif_desc":
                                arr["no_nota_intern"]
                                + " telah "
                                + this.getProsesByFungsi(me.getFungsi())
                                + " oleh "
                                + me.getNmFungsi()
                                + "(" + this.getNmByFungsi(me.getFungsi(), arr) + ")\n\n"
                                + "Catatan:\n"
                                + this.getCatByFungsi(me.getFungsi(), arr),
                            "sent": "0",
                            "tgl_kirim": this.state.myTimer["now"],
                            "seen": "0"
                        };
                        this.arrNotif.push(arrTmp);

                    }
                }
            } else if (me.getRow()["status"] == 3) {
                if (me.getFungsi() == "FUNGSI_001") {
                    arr[status] = "0";
                    arr["status_pengajuan"] = "0";
                    arr["status_approval_kakanwil"] = "0";
                    arr["status_approval_minkeu"] = "0";
                    arr["status_verifikasi"] = "0";
                    arr["status_approval_bagkeu"] = "0";
                } else {
                    arr[status] = "4";
                    let wlk = me.getFirst();
                    while (wlk.getNext() != null) {
                        if (wlk != me) {
                            if (this.getStatusByFungsi(wlk.getFungsi(), arr) == "3" || this.getStatusByFungsi(wlk.getFungsi(), arr) == "4") {
                                let arrTmp = {
                                    "id_notifikasi": "",
                                    "id_pegawai": this.getIdByFungsi(wlk.getFungsi(), arr),
                                    "id_tagihan": arr["id_tagihan"],
                                    "notif_title": "Progres Tagihan",
                                    "notif_desc":
                                        me.getNmFungsi()
                                        + "(" + this.getNmByFungsi(me.getFungsi(), arr) + ")"
                                        + " menyetujui revisi tagihan "
                                        + arr["no_nota_intern"]
                                        + "\n\n"
                                        + "Catatan:\n"
                                        + this.getCatByFungsi(me.getFungsi(), arr),
                                    "sent": "0",
                                    "tgl_kirim": this.state.myTimer["now"],
                                    "seen": "0"
                                };
                                this.arrNotif.push(arrTmp);
                            }
                        }
                        wlk = wlk.getNext();
                    }
                }
                arr["status_tagihan"] = "EDITING";
            }
        } else if (this.state.actionChosen == "REVISE") {
            arr[status] = "4";
            arr["status_tagihan"] = "EDITING";
            var w = me;
            while (w.getPrev() != null) {
                w = w.getPrev();
                if (w.getFungsi() == "FUNGSI_001") {
                    arr["status_pembuatan"] = "3";
                } else if (w.getFungsi() == "FUNGSI_002") {
                    arr["status_pengajuan"] = "3";
                } else if (w.getFungsi() == "FUNGSI_003") {
                    arr["status_approval_kakanwil"] = "3";
                } else if (w.getFungsi() == "FUNGSI_004") {
                    arr["status_approval_minkeu"] = "3";
                } else if (w.getFungsi() == "FUNGSI_005") {
                    arr["status_verifikasi"] = "3";
                } else {
                    arr["status_approval_bagkeu"] = "3";
                }
            }
            let wlk = me;
            while (wlk.getPrev() != null) {
                wlk = wlk.getPrev();
                let arrTmp = {
                    "id_notifikasi": "",
                    "id_pegawai": this.getIdByFungsi(wlk.getFungsi(), arr),
                    "id_tagihan": arr["id_tagihan"],
                    "notif_title": "Permintaan Revisi Tagihan",
                    "notif_desc":
                        me.getNmFungsi()
                        + "(" + this.getNmByFungsi(me.getFungsi(), arr) + ")"
                        + " meminta revisi tagihan "
                        + arr["no_nota_intern"] + "\n\n"
                        + "Catatan:\n"
                        + this.getCatByFungsi(me.getFungsi(), arr),
                    "sent": "0",
                    "tgl_kirim": this.state.myTimer["now"],
                    "seen": "0"
                };
                this.arrNotif.push(arrTmp);

            }
        } else if (this.state.actionChosen == "REJECT") {
            this.deleteAllNotifs = true;
            if (arr[status] == "0") {
                arr[status] = "2";
                let wlk = me;
                while (wlk.getPrev() != null) {
                    wlk = wlk.getPrev();
                    let arrTmp = {
                        "id_notifikasi": "",
                        "id_pegawai": this.getIdByFungsi(wlk.getFungsi(), arr),
                        "id_tagihan": arr["id_tagihan"],
                        "notif_title": "Tagihan Ditolak",
                        "notif_desc":
                            arr["no_nota_intern"]
                            + " tidak "
                            + this.getProsesByFungsi(me.getFungsi())
                            + " oleh "
                            + me.getNmFungsi()
                            + "(" + this.getNmByFungsi(me.getFungsi(), arr) + ")\n\n"
                            + "Catatan:\n"
                            + this.getCatByFungsi(me.getFungsi(), arr),
                        "sent": "0",
                        "tgl_kirim": this.state.myTimer["now"],
                        "seen": "0"
                    };
                    this.arrNotif.push(arrTmp);

                }
            } else {
                arr[status] = "5";
                let wlk = me.getFirst();
                while (wlk.getNext() != null) {
                    if (wlk != me) {
                        if (this.getStatusByFungsi(wlk.getFungsi(), arr) == "3" || this.getStatusByFungsi(wlk.getFungsi(), arr) == "4") {
                            let arrTmp = {
                                "id_notifikasi": "",
                                "id_pegawai": this.getIdByFungsi(wlk.getFungsi(), arr),
                                "id_tagihan": arr["id_tagihan"],
                                "notif_title": "Tagihan Ditolak",
                                "notif_desc":
                                    me.getNmFungsi()
                                    + "(" + this.getNmByFungsi(me.getFungsi(), arr) + ")"
                                    + " menolak revisi tagihan "
                                    + arr["no_nota_intern"]
                                    + "\n\n"
                                    + "Catatan:\n"
                                    + this.getCatByFungsi(me.getFungsi(), arr),
                                "sent": "0",
                                "tgl_kirim": this.state.myTimer["now"],
                                "seen": "0"
                            }
                            this.arrNotif.push(arrTmp);
                        }
                    }
                    wlk = wlk.getNext();
                }
            }
            arr["status_tagihan"] = "FAILED";
        }

        let updPerson = new CurrentDisposisi();
        updPerson.fillData(arr);
        let nxtPerson = this.getCurrentStatusPerson(updPerson.getFirst());
        if (nxtPerson == null) {
            console.log("NEXT PERSON NULL");
            this.setState({ myData: arr });
            //SAVE
            this.saveData();
        } else {
            console.log("NEXT PERSON NOT NULL");
            var idNxt = this.getIdByFungsi(nxtPerson.getFungsi(), arr);
            if (idNxt != "") {
                console.log("NEXT PERSON NOT NULL: " + idNxt);
                let arrTmp = {
                    "id_notifikasi": "",
                    "id_pegawai": idNxt,
                    "id_tagihan": arr["id_tagihan"],
                    "notif_title": "Tagihan untuk diproses",
                    "notif_desc":
                        arr["no_nota_intern"]
                        + " butuh diproses oleh anda.",
                    "sent": "0",
                    "tgl_kirim": this.state.myTimer["now"],
                    "seen": "0"
                }
                this.arrNotif.push(arrTmp);
                this.setState({ myData: arr });
                //SAVE
                this.saveData();
            } else {
                console.log("NEXT PERSON ID NULL");
                this.setState({ loading: true })
                let url = MyServerSettings.getPhp("get_pegawai_by_fungsi.php") + "?bid=" + arr["id_bidang"] + "&f=" + nxtPerson.getFungsi();
                console.log(url);
                fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        idNxt = responseJson[0]["id_pegawai"];
                        for (var i = 0; i < responseJson.length; i++) {
                            if (responseJson[i]["id_bidang"] == arr["id_bidang"]) {
                                idNxt = responseJson[i]["id_pegawai"];
                                break;
                            }
                        }
                        if (this.getIdByFungsi(me.getFungsi(), arr) == idNxt) {
                            this.setState({ loading: false, myData: arr });
                            //SAVE
                            this.saveData();
                        } else {
                            let arrTmp = {
                                "id_notifikasi": "",
                                "id_pegawai": idNxt,
                                "id_tagihan": arr["id_tagihan"],
                                "notif_title": "Tagihan untuk diproses",
                                "notif_desc":
                                    arr["no_nota_intern"]
                                    + " butuh diproses oleh anda.",
                                "sent": "0",
                                "tgl_kirim": this.state.myTimer["now"],
                                "seen": "0"
                            }
                            this.arrNotif.push(arrTmp);
                            this.setState({ loading: false, myData: arr });
                            //SAVE
                            this.saveData();
                        }
                    })
                    .catch((error) => {
                        console.log('Error selecting random data: ' + error);
                        this.setState({ loading: false, myData: arr });
                        //SAVE
                        this.saveData();
                    });
            }


        }
    }

    delNotifs = () => {
        if (this.deleteAllNotifs) {
            fetch(MyServerSettings.getPhp("delete_notifs.php") + '?id=' + this.state.myData["id_tagihan"])
                .then((response) => response.json())
                .then((responseJson) => {
                    var res = responseJson[0];
                    if (res["succeed"] == "1") {
                        this.saveNotif();
                    } else {
                        MyFunctions.msgBox("Error Koneksi");
                    }
                })
                .catch((error) => {
                    console.log('Error selecting random data: ' + error)
                });
        } else {
            this.saveNotif();
        }

    }

    saveNotif = () => {
        console.log(JSON.stringify(this.arrNotif));
        this.setState({ loading: true })
        fetch(
            MyServerSettings.getPhp("post_new_notifs.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.arrNotif),
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myResultNotif: responseJson
                })
            })
            .then(this.processResultNotif)
            .catch((error) => {
                console.log('Error selecting random data NOTIF: ' + error)
                this.setState({ loading: false })
            });
    }

    saveData = () => {

        let arr = [];
        arr.push([]);
        let tmp = [];
        tmp.push(this.state.myData);
        arr.push(tmp);
        this.setState({ loading: true })
        //console.log("===================================          "+JSON.stringify(arr)+"                *****************************");
        fetch(
            MyServerSettings.getPhp("post_tagihan.php"),
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
                this.setState({
                    loading: false,
                    myResult: responseJson
                })
            })
            .then(this.processResult)
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });
    }

    processResultNotif = () => {
        if (this.state.myResultNotif[0]['succeed']) {
            MyFunctions.msgBox("Data tersimpan");
            this.props.navigation.goBack();
        } else {
            MyFunctions.msgBox("Gagal menyimpan\n" + this.state.myResultNotif[0]['error']);
        }
    }
    processResult = () => {
        if (this.state.myResult[0]['succeed']) {
            this.delNotifs();
        } else {
            MyFunctions.msgBox("Gagal menyimpan\n" + this.state.myResult[0]['error']);
        }
    }

    onRowDidOpen = rowKey => {

    };
    renderHiddenItem = (data, rowMap) => (
        <View style={Global.customStyles.rowBack}>

        </View>
    );


    validData = () => {
        if (this.state.allowSave) {
            Alert.alert("Konfirmasi?", "Anda belum menyimpan data yang telah diubah. Batalkan perubahan?", [
                {
                    text: "Tidak",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "Ya", onPress: () => {
                        this.props.navigation.goBack();
                    }
                }
            ]);
        } else this.props.navigation.goBack();
    }

    backAction = () => {
        if (this.state.actionChosen != "NONE") {
            this.setState({ actionChosen: "NONE" });
        } else {
            this.props.navigation.goBack();
        }
        return true;
    };

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={this.backAction}
                >
                    <MaterialCommunityIcons
                        name="menu-left"
                        size={40}
                        color='#101417'
                    />
                </TouchableOpacity>
            ),
        });
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );

        this.loadTimer();

        this.focusListener = this.props.navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            this.refreshData();
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    refreshData = () => {
        /*
        this.setState({
            loading: true,
            myParentData: props.route.params.myParentData,
            myData: []


            loading: false,
            idTagihan: props.route.params.idTagihan,
            myData: [],
            allowSave: false,
            allowRincian: false
        });*/
        this.loadTimer();

    }



    loadData = () => {
        if (this.state.myData.length === 0) {
            this.setState({ loading: true })
            fetch(MyServerSettings.getPhp("get_current_tagihan.php") + '?id=' + this.state.idTagihan)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        loading: false,
                        myData: responseJson[0]
                    })
                    this.person = new CurrentDisposisi();
                    this.person.fillData(this.state.myData);
                    if (this.state.myData["no_verifikasi"] == "" && Global.getIdFungsi() == "FUNGSI_005") {
                        let arr = this.state.myData;
                        arr["no_verifikasi"] = this.injectNoVeri("", MyFunctions.leadingZero(this.state.myNewNoVeri["no"], 3));
                        this.setState({
                            myData: arr
                        });
                    }
                    if (this.state.myData["no_bukti_pembayaran"] == "" && Global.getIdFungsi() == "FUNGSI_006") {
                        console.log(this.injectNoBayar("", MyFunctions.leadingZero(this.state.myNewNoBayar["no"], 3)));
                        let arr = this.state.myData;
                        arr["no_bukti_pembayaran"] = this.injectNoBayar("", MyFunctions.leadingZero(this.state.myNewNoBayar["no"], 3));
                        this.setState({
                            myData: arr
                        });
                    }

                })
                .catch((error) => {
                    console.log('Error selecting random data TAGIHAN: ' + error)
                    this.setState({
                        loading: false
                    })

                });
        } else {
            this.setState({
                loading: false,
                myData: this.state.myData
            });
        }
    }
    loadTimer = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("now.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myTimer: responseJson[0]
                })
            })
            .then(this.loadNewNoVeri())
            .catch((error) => {
                MyFunctions.msgBox("Maaf, terjadi kesalahan pada koneksi jaringan.");
                console.log('Error selecting random data TIMER: ' + error)
                this.setState({ loading: false })
            });

    }

    extractNoVeri = (str) => {
        if (str == "" || str == undefined) return "000";
        var el = str.split("/");
        if (el.length === 0) return "000";
        return el[0] == "" ? "000" : el[0];
    }
    extractNoVeriLast = (str) => {
        if (str == "" || str == undefined) return "";
        var el = str.split("/");
        if (el.length < 5) return "";
        return "/" + el[1] + "/" + el[2] + "/" + el[3] + "/" + el[4];
    }
    injectNoVeri = (str, toInject) => {
        if (str == "" || str == undefined) str = "001/" + this.state.myData["kode_bidang"] + "/" + unknownCode + "/" + moment(this.state.myTimer["now"]).format('MM') + "/" + moment(this.state.myTimer["now"]).format('YYYY');

        let el = str.split("/");
        if (el.length < 5) return "001/" + this.state.myData["kode_bidang"] + "/" + unknownCode + "/" + moment(this.state.myData["tgl_verifikasi"]).format('MM') + "/" + moment(this.state.myData["tgl_verifikasi"]).format('YYYY');

        return toInject + "/" + el[1] + "/" + el[2] + "/" + el[3] + "/" + el[4];
    }
    loadNewNoVeri = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_new_no_veri.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myNewNoVeri: responseJson[0]
                })
            })
            .then(this.loadNewNoBayar())
            .catch((error) => {
                MyFunctions.msgBox("Maaf, terjadi kesalahan pada koneksi jaringan.");
                console.log('Error selecting random data No Veri: ' + error)
                this.setState({ loading: false })
            });
    }


    extractNoBayar = (str) => {
        if (str == "" || str == undefined) return "000";
        var el = str.split("/");
        if (el.length === 0) return "000";
        return el[0] == "" ? "000" : el[0];
    }
    extractNoBayarLast = (str) => {
        if (str == "" || str == undefined) return "";
        var el = str.split("/");
        if (el.length < 3) return "";
        return "/" + el[1] + "/" + el[2];
    }
    injectNoBayar = (str, toInject) => {
        if (str == "" || str == undefined) str = "001/" + moment(this.state.myTimer["now"]).format('MM') + "/" + moment(this.state.myTimer["now"]).format('YYYY');

        let el = str.split("/");
        if (el.length < 3) return "001/" + moment(this.state.myData["tgl_bayar"]).format('MM') + "/" + moment(this.state.myData["tgl_bayar"]).format('YYYY');

        return toInject + "/" + el[1] + "/" + el[2];
    }
    loadNewNoBayar = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_new_no_bayar.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myNewNoBayar: responseJson[0]
                })
            })
            .then(this.loadData())
            .catch((error) => {
                MyFunctions.msgBox("Maaf, terjadi kesalahan pada koneksi jaringan.");
                console.log('Error selecting random data No Veri: ' + error)
                this.setState({ loading: false })
            });
    }


    renderDataItem = ({ item, index }) => {

        return (
            <View style={Global.customStyles.ListItem} >
                <Text style={{ fontWeight: 'bold' }}>{item.nm_item}</Text>
                <Text>{MyFunctions.formatMoney(item.qty) + " " + item.satuan} @Rp.{MyFunctions.formatMoney(item.harga)}</Text>
                <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>Rp.{MyFunctions.formatMoney(Number.parseFloat(item.qty) * Number.parseFloat(item.harga))}</Text>
            </View>
        )
    }
    countTotal() {
        if (this.state.myData.length === 0) return 0;
        var msgTotal = this.state.myData["det_array"].reduce(function (prev, cur) {
            return prev + (cur.qty * cur.harga);
        }, 0);
        return msgTotal;
    }

}




const styles = StyleSheet.create({

    MainContainer: {
        margin: 1,
        padding: 5,

    },

    ContentContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        padding: 5,
        elevation: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    LoadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        margin: 5
    },

    ActivityIndicator: {
        width: '100%',
    },
    ActivityIndicatorText: {
        width: '100%',
        textAlign: 'center'
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },

    AddButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0

    },

    FlatListItemStyle: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }

});

AppRegistry.registerComponent('ScreenTagihanAction', () => ScreenTagihanAction);
export default ScreenTagihanAction;