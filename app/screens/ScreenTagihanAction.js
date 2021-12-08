import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, Alert, Switch, BackHandler, RefreshControl, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity, ImageBackground, TouchableHighlight, TouchableOpacityBase } from 'react-native';
import Global from '../functions/Global';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyFunctions from '../functions/MyFunctions';
import moment from 'moment/min/moment-with-locales';
import { SwipeListView } from 'react-native-swipe-list-view';
import CurrentDisposisi from '../functions/CurrentDisposisi';



class ScreenTagihanAction extends Component {
    keyExtractor = (data, index) => index + "";
    person = new CurrentDisposisi();

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            idTagihan: props.route.params.idTagihan,
            myData: [],
            myTimer: [],
            myResult: [],
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

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/invoice.jpeg')}>
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
                            <Text style={Global.customStyles.Label}>No. Bukti Pembayaran</Text>
                            <TextInput
                                value={this.state.myData["no_bukti_pembayaran"]}
                                multiline={true}
                                onChangeText={(no_bukti_pembayaran) => {
                                    no_bukti_pembayaran = MyFunctions.validateString(no_bukti_pembayaran);
                                    let arr = this.state.myData;
                                    arr["no_bukti_pembayaran"] = no_bukti_pembayaran;
                                    this.setState({ myData: arr });
                                }}
                                placeholder={'No. Bukti Pembayaran'}
                                //secureTextEntry={true}
                                style={Global.customStyles.Input}
                            />
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
                    //secureTextEntry={true}
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
                    <TouchableOpacity onPress={this.saveData} disabled={this.disableActionOk()}>
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
        //this.state.loading
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
                veriOk = (this.state.myData["kesesuaian_data"] == "1") && (this.state.myData["kesesuaian_perhitungan"] == "1");
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
        if (this.state.actionChosen == "APPROVE") {
            if (me.getRow()["status"] == 0) {
                arr[status] = "1";
                if (me.getFungsi() == "FUNGSI_006") {
                    arr["status_tagihan"] = "COMPLETED";
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
        } else if (this.state.actionChosen == "REJECT") {
            if (arr[status] == "0") {
                arr[status] = "2";
            } else {
                arr[status] = "5";
            }
            arr["status_tagihan"] = "FAILED";
        }
        if (me.getFungsi() != "FUNGSI_001") {
            arr[id] = Global.getCurUserId();
            arr[nm] = Global.getNmPeg();
            arr[jab] = Global.getNmJab();
            arr[tgl] = this.state.myTimer["now"];
        }
        this.setState({ myData: arr });
    }

    saveData = () => {
        this.setSaveAction();
        let arr = [];
        arr.push([]);
        let tmp = [];
        tmp.push(this.state.myData);
        arr.push(tmp);
        //console.log(JSON.stringify(arr));
        this.setState({ loading: true })
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

    processResult = () => {
        if (this.state.myResult[0]['succeed']) {
            alert("Data tersimpan");
            this.props.navigation.goBack();
        } else {
            alert("Gagal menyimpan\n" + this.state.myResult[0]['error']);
        }
        //return true;
    }

    onRowDidOpen = rowKey => {
        //console.log('This row opened', rowKey);
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
        //this.validData();
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

        //let f = async () => { this.loadTimer() };
        //let f2 = async () => { await f().then(this.loadNewNI()) };
        //let f3 = async () => { await f2().then(this.loadData()) };
        //f3();

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
                    //console.log(this.person.findMe(Global.getIdFungsi()).getRow()["nm"]);

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
            .then(this.loadData())
            .catch((error) => {
                alert("Maaf, terjadi kesalahan pada koneksi jaringan.");
                console.log('Error selecting random data TIMER: ' + error)
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
        //justifyContent: 'center',
        //flex: 1,
        //alignContent: 'flex-start',
        margin: 1,
        //paddingTop: (Platform.OS === 'ios') ? 20 : 0,
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
        //borderWidth: 5
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