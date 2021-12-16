import moment from 'moment/min/moment-with-locales';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, AppRegistry, BackHandler, Button, ImageBackground, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';
import MyFunctions from '../functions/MyFunctions';
import MyServerSettings from '../functions/MyServerSettings';




const unknownCode = "KU.04.02";

class ScreenTagihanEdit extends Component {
    keyExtractor = (data, index) => index + "";
    myDataBU = [];

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            idTagihan: props.route.params.idTagihan,
            myData: [],
            myDataDetToDelete: [],
            myTimer: [],
            myNewNI: [],
            myResult: [],
            allowSave: false
        }
    }

    newRecord = () => {
        return ({
            'id_tagihan': '',
            'ket_tagihan': '',
            'id_bidang': Global.getIdBidang(),
            'id_pembuat': Global.getCurUserId(),
            'nm_pembuat': Global.getNmPeg(),
            'jab_pembuat': Global.getNmJab(),
            'cat_pembuat': '',
            'tgl_pembuatan': this.state.myTimer["now"],
            'status_pembuatan': '0',
            'no_nota_intern': this.injectNI("", MyFunctions.leadingZero(this.state.myNewNI["ni"], 3)),
            'id_pengaju': '',
            'nm_pengaju': '',
            'jab_pengaju': '',
            'cat_pengaju': '',
            'tgl_pengajuan': this.state.myTimer["now"],
            'status_pengajuan': '0',
            'id_kakanwil': '',
            'nm_kakanwil': '',
            'jab_kakanwil': '',
            'cat_kakanwil': '',
            'tgl_disposisi_kakanwil': this.state.myTimer["now"],
            'status_approval_kakanwil': '0',
            'id_minkeu': '',
            'nm_minkeu': '',
            'jab_minkeu': '',
            'cat_minkeu': '',
            'tgl_disposisi_minkeu': this.state.myTimer["now"],
            'status_approval_minkeu': '0',
            'id_verifikator': '',
            'nm_verifikator': '',
            'jab_verifikator': '',
            'cat_verifikator': '',
            'tgl_verifikasi': this.state.myTimer["now"],
            'kesesuaian_data': '0',
            'kesesuaian_perhitungan': '0',
            'status_verifikasi': '0',
            'no_verifikasi': '',
            'id_bag_keu': '',
            'nm_bag_keu': '',
            'jab_bag_keu': '',
            'cat_bag_keu': '',
            'tgl_bayar': this.state.myTimer["now"],
            'status_approval_bagkeu': '0',
            'no_bukti_pembayaran': '',
            'status_tagihan': '',
            'nm_bidang': '',
            'kode_bidang': '',
            'det_array': []
        });
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
                            <Text style={[Global.customStyles.Label, { textAlign: 'right' }]}>{moment(this.state.myData['tgl_pembuatan']).locale("id").format("llll")}</Text>
                            <View style={{ margin: 3 }}></View>
                            <Text style={Global.customStyles.Label}>Nomor Nota Intern</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginHorizontal: 10 }}>
                                <Text style={Global.customStyles.Label}>NI- </Text>
                                <TextInput
                                    value={this.extractNI(this.state.myData["no_nota_intern"])}
                                    multiline={false}
                                    onChangeText={(no_nota_intern) => {
                                        no_nota_intern = MyFunctions.validateInputNumbersOnly(no_nota_intern);
                                        let arr = this.state.myData;
                                        arr['no_nota_intern'] = this.injectNI(this.state.myData['no_nota_intern'], no_nota_intern);
                                        this.setState({ myData: arr });
                                        this.setAllowSave();
                                    }}
                                    placeholder={'Nomor NI'}
                                    keyboardType="numeric"
                                    numeric
                                    style={[Global.customStyles.Input, { width: 80, marginBottom: 0 }]}
                                />
                                <Text style={Global.customStyles.Label}> {this.extractNILast(this.state.myData["no_nota_intern"])}</Text>
                            </View>

                            <Text style={Global.customStyles.Label}>Uraian</Text>
                            <TextInput
                                value={this.state.myData['ket_tagihan']}
                                multiline={true}
                                onChangeText={(ket_tagihan) => {
                                    ket_tagihan = MyFunctions.validateString(ket_tagihan);
                                    let arr = this.state.myData;
                                    arr['ket_tagihan'] = ket_tagihan;
                                    this.setState({ myData: arr });
                                    this.setAllowSave();
                                }}
                                placeholder={'Uraian'}
                                style={Global.customStyles.Input}
                            />
                            <Text style={Global.customStyles.Label}>Keterangan</Text>
                            <TextInput
                                value={this.state.myData['cat_pembuat']}
                                multiline={true}
                                onChangeText={(cat_pembuat) => {
                                    cat_pembuat = MyFunctions.validateString(cat_pembuat);
                                    let arr = this.state.myData;
                                    arr['cat_pembuat'] = cat_pembuat;
                                    this.setState({ myData: arr });
                                    this.setAllowSave();
                                }}
                                placeholder={'Catatan'}
                                style={Global.customStyles.Input}
                            />
                            <Text style={Global.customStyles.Label}>Total (bruto): Rp. {MyFunctions.formatMoney(this.countTotal())}</Text>
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1 }}>
                            <SwipeListView
                                data={this.state.myData["det_array"]}
                                renderItem={this.renderDataItem}
                                renderHiddenItem={this.renderHiddenItem}
                                leftOpenValue={0}
                                rightOpenValue={-75}
                                previewRowKey={'0'}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                onRowDidOpen={this.onRowDidOpen}
                                keyExtractor={this.keyExtractor}
                                style={{ width: '100%' }}
                                refreshControl={
                                    <RefreshControl refreshing={this.state.loading} onRefresh={this.refreshData} />
                                }
                            />
                            <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Edit Detail Tagihan', { myData: this.state.myData, myDataDetIndex: this.state.myData["det_array"].length, myDataDetToDelete: this.state.myDataDetToDelete })}
                                disabled={this.state.loading}
                            >
                                <MaterialCommunityIcons
                                    name="plus-circle"
                                    size={50}
                                    color='#101417'
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>
                            <Button
                                title={'Simpan'}
                                color='#101417'
                                disabled={!(this.state.allowSave && !this.state.loading)}
                                onPress={this.saveData}
                            />
                        </View>





                    </View>
                    <View style={styles.LoadingContainer}>
                        <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                        {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}
                    </View>

                </View>
            </ImageBackground>
        )

    }

    extractNI = (str) => {
        if (str == "" || str == undefined) return "000";
        var arr = str.split("-");
        if (arr.length < 2) return "000";
        var el = arr[1].split("/");
        if (el.length === 0) return "000";
        return el[0] == "" ? "000" : el[0];
    }
    extractNILast = (str) => {
        if (str == "" || str == undefined) return "";
        var arr = str.split("-");
        if (arr.length < 2) return "";
        var el = arr[1].split("/");
        if (el.length < 5) return "";
        return "/" + el[1] + "/" + el[2] + "/" + el[3] + "/" + el[4];
    }
    injectNI = (str, toInject) => {
        if (str == "" || str == undefined) str = "NI-001/" + Global.getKodeBidang() + "/" + unknownCode + "/" + moment(this.state.myTimer["now"]).format('MM') + "/" + moment(this.state.myTimer["now"]).format('YYYY');

        let arr = str.split("-");
        if (arr.length < 2) return "NI-001/" + Global.getKodeBidang() + "/" + unknownCode + "/" + moment(this.state.myData["tgl_pembuatan"]).format('MM') + "/" + moment(this.state.myData["tgl_pembuatan"]).format('YYYY');

        let el = arr[1].split("/");
        if (el.length < 5) return "NI-001/" + Global.getKodeBidang() + "/" + unknownCode + "/" + moment(this.state.myData["tgl_pembuatan"]).format('MM') + "/" + moment(this.state.myData["tgl_pembuatan"]).format('YYYY');

        return "NI-" + toInject + "/" + el[1] + "/" + el[2] + "/" + el[3] + "/" + el[4];
    }

    saveData = () => {
        let arr = [];
        arr.push(this.state.myDataDetToDelete);
        let tmp = [];
        tmp.push(this.state.myData);
        arr.push(tmp);
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
            MyFunctions.msgBox("Data tersimpan");
            this.props.navigation.goBack();
        } else {
            MyFunctions.msgBox("Gagal menyimpan\n" + this.state.myResult[0]['error']);
        }
    }
    deleteRow = (rowMap, rowKey) => {
        let arr = this.state.myData;

        Alert.alert("Konfirmasi!", "Hapus item '" + arr["det_array"][rowKey]["nm_item"] + "'?", [
            {
                text: "Batal",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "Ya", onPress: () => {
                    let del = this.state.myDataDetToDelete;
                    if (arr["det_array"][rowKey]["id_det_item"] !== "") {
                        del.push(arr["det_array"][rowKey]["id_det_item"]);
                    }
                    arr["det_array"].splice(rowKey, 1);
                    this.setState({ myData: arr, myDataDetToDelete: del });
                    this.setAllowSave();
                }
            }
        ]);

    };
    onRowDidOpen = rowKey => {

    };
    renderHiddenItem = (data, rowMap) => (
        <View style={Global.customStyles.rowBack}>
            <TouchableOpacity
                style={[Global.customStyles.backRightBtn, Global.customStyles.backRightBtnRight]}
                onPress={() => this.deleteRow(rowMap, data.index)}
            >
                <MaterialCommunityIcons
                    name="delete"
                    size={30}
                    color='#101417'
                />
                <Text style={{ color: '#101417' }}>Hapus</Text>
            </TouchableOpacity>
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
        this.validData();
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
                    this.backupData();
                })
                .catch((error) => {
                    console.log('Error selecting random data TAGIHAN: ' + error)
                    this.setState({
                        loading: false,
                        myData: this.newRecord()
                    })
                    this.backupData();

                });
        } else {
            this.setState({
                loading: false,
                myData: this.state.myData
            });
        }
        this.setAllowSave();
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
            .then(this.loadNewNI())
            .catch((error) => {
                MyFunctions.msgBox("Maaf, terjadi kesalahan pada koneksi jaringan.");
                console.log('Error selecting random data TIMER: ' + error)
                this.setState({ loading: false })
            });

    }
    loadNewNI = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_new_ni.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myNewNI: responseJson[0]
                })
            })
            .then(this.loadData())
            .catch((error) => {
                MyFunctions.msgBox("Maaf, terjadi kesalahan pada koneksi jaringan.");
                console.log('Error selecting random data NI: ' + error)
                this.setState({ loading: false })
            });
    }
    backupData = () => {
        this.myDataBU = JSON.parse(JSON.stringify(this.state.myData));
    }
    setAllowSave = () => {
        console.log("AAAAA    " + this.extractNI(this.state.myData["no_nota_intern"]));
        let edited = (JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU));
        this.setState({
            allowSave: edited && (Number.parseInt(this.extractNI(this.state.myData["no_nota_intern"])) !== 0) && (this.state.myData["ket_tagihan"] !== "") && (this.state.myData["det_array"].length > 0)
        });
    }

    renderDataItem = ({ item, index }) => {

        return (
            <TouchableOpacity style={Global.customStyles.ListItem} onPress={() => this.props.navigation.navigate('Edit Detail Tagihan', { myDataDetIndex: index, myData: this.state.myData, myDataDetToDelete: this.state.myDataDetToDelete })}>
                <Text style={{ fontWeight: 'bold' }}>{item.nm_item}</Text>
                <Text>{MyFunctions.formatMoney(item.qty) + " " + item.satuan} @Rp.{MyFunctions.formatMoney(item.harga)}</Text>
                <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>Rp.{MyFunctions.formatMoney(Number.parseFloat(item.qty) * Number.parseFloat(item.harga))}</Text>
            </TouchableOpacity>
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

AppRegistry.registerComponent('ScreenTagihanEdit', () => ScreenTagihanEdit);
export default ScreenTagihanEdit;