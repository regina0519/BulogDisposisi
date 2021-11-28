import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, Alert, BackHandler, RefreshControl, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity, ImageBackground, TouchableHighlight, TouchableOpacityBase } from 'react-native';
import Global from '../functions/Global';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyFunctions from '../functions/MyFunctions';
import moment from 'moment/min/moment-with-locales';
import { SwipeListView } from 'react-native-swipe-list-view';





class ScreenTagihanEdit extends Component {
    keyExtractor = (data, index) => index + "";
    myDataBU = [];

    constructor(props) {

        super(props);
        //console.log('jojojojojoj');
        //alert(props.route.params.mode);
        this.state = {
            loading: false,
            idTagihan: props.route.params.idTagihan,
            myData: [],
            myDataDetToDelete: [],
            allowSave: false
        }
    }

    newRecord = () => {
        return ({
            'id_tagihan': '',
            'ket_tagihan': '',
            'id_bidang': '',
            'id_pembuat': '',
            'nm_pembuat': '',
            'jab_pembuat': '',
            'cat_pembuat': '',
            'tgl_pembuatan': new Date().getFullYear() + '-' + MyFunctions.leadingZero((new Date().getMonth() + 1), 2) + '-' + MyFunctions.leadingZero(new Date().getDate(), 2) + ' ' + MyFunctions.leadingZero(new Date().getHours(), 2) + ':' + MyFunctions.leadingZero(new Date().getMinutes(), 2) + ':' + MyFunctions.leadingZero(new Date().getSeconds(), 2),
            'status_pembuatan': '0',
            'no_nota_intern': '',
            'id_pengaju': '',
            'nm_pengaju': '',
            'jab_pengaju': '',
            'cat_pengaju': '',
            'tgl_pengajuan': '',
            'status_pengajuan': '0',
            'id_kakanwil': '',
            'nm_kakanwil': '',
            'jab_kakanwil': '',
            'cat_kakanwil': '',
            'tgl_disposisi_kakanwil': '',
            'status_approval_kakanwil': '0',
            'id_minkeu': '',
            'nm_minkeu': '',
            'jab_minkeu': '',
            'cat_minkeu': '',
            'tgl_disposisi_minkeu': '',
            'status_approval_minkeu': '0',
            'id_verifikator': '',
            'nm_verifikator': '',
            'jab_verifikator': '',
            'cat_verifikator': '',
            'tgl_verifikasi': '',
            'kesesuaian_data': '0',
            'kesesuaian_perhitungan': '0',
            'status_verifikasi': '0',
            'no_verifikasi': '',
            'id_bag_keu': '',
            'nm_bag_keu': '',
            'jab_bag_keu': '',
            'cat_bag_keu': '',
            'tgl_bayar': '',
            'status_approval_bagkeu': '0',
            'no_bukti_pembayaran': '',
            'status_tagihan': '',
            'det_array': []
        });
    }


    render() {
        //console.log(JSON.stringify(this.state.myData));
        //alert("rendered");

        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/invoice.jpeg')}>
                <View style={styles.MainContainer}>
                    <View style={styles.ContentContainer}>
                        <View style={{ margin: 5 }}>
                            <Text style={[Global.customStyles.Label, { textAlign: 'right' }]}>{moment(this.state.myData['tgl_pembuatan']).locale("id").format("llll")}</Text>
                            <View style={{ margin: 3 }}></View>
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
                                //secureTextEntry={true}
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
                                //secureTextEntry={true}
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
                            {console.log(this.state.allowSave + "    " + this.state.loading)}
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

    saveData = () => {
        console.log(this.state.myDataDetToDelete);
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
                        //console.log("bef: " + del.length);
                        del.push(arr["det_array"][rowKey]["id_det_item"]);
                        //console.log("aft: " + del.length);
                    }
                    arr["det_array"].splice(rowKey, 1);
                    this.setState({ myData: arr, myDataDetToDelete: del });
                    this.setAllowSave();
                }
            }
        ]);

    };
    onRowDidOpen = rowKey => {
        //console.log('This row opened', rowKey);
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
        this.loadData();

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
        this.loadData();

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
                    //console.log(this.state.myData["det_array"])
                })
                .catch((error) => {
                    console.log('Error selecting random data: ' + error)
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
    backupData = () => {
        this.myDataBU = JSON.parse(JSON.stringify(this.state.myData));
    }
    setAllowSave = () => {
        //console.log(JSON.stringify(this.state.myData));
        let edited = (JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU));
        this.setState({
            allowSave: edited && (this.state.myData["ket_tagihan"] !== "") && (this.state.myData["det_array"].length > 0)
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

AppRegistry.registerComponent('ScreenTagihanEdit', () => ScreenTagihanEdit);
export default ScreenTagihanEdit;