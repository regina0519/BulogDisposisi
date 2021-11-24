import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyFunctions from '../functions/MyFunctions';





class ScreenTagihanEdit extends Component {
    myDataBU = [];

    constructor(props) {

        super(props);
        //console.log('jojojojojoj');
        //alert(props.route.params.mode);
        this.state = {
            loading: false,
            idTagihan: props.route.params.idTagihan,
            myData: [],
            allowSave: false,
            allowRincian: false
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
            'tgl_pembuatan': '',
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

            <View style={styles.MainContainer}>
                <TextInput
                    value={this.state.myData['ket_tagihan']}
                    multiline={true}
                    onChangeText={(ket_tagihan) => {
                        ket_tagihan = MyFunctions.validateString(ket_tagihan);
                        let arr = this.state.myData;
                        arr['ket_tagihan'] = ket_tagihan;
                        this.setState({ myData: arr });
                        this.setAllowRincian();
                        this.setAllowSave();
                    }}
                    placeholder={'Uraian'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
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
                    style={styles.input}
                />
                <Button
                    title={'Simpan'}
                    style={styles.input}
                    disabled={!this.state.allowSave}
                    onPress={() => this.props.navigation.navigate('Detail Tagihan', { myParentData: this.state.myData })}
                />
                <View style={{ margin: 5 }}></View>
                <Button
                    title={'Rincian'}
                    style={styles.input}
                    disabled={!this.state.allowRincian}
                    onPress={() => this.props.navigation.navigate('Detail Tagihan', { myParentData: this.state.myData })}
                />
                <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}

            </View>
        )

    }

    next() {
        //this.props.navigation.navigate('Tambah Detail Tagihan', { myData: this.state.myData });
    }


    componentDidMount() {
        this.loadData();
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
        });
        this.loadData();
        */
    }
    loadData = () => {
        if (this.state.myData.length === 0) {
            this.setState({ loading: true })
            fetch(MyServerSettings.getPhp("get_current_tagihan.php") + '?id=' + this.state.idTagihan)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        loading: false,
                        myData: responseJson
                    })
                    this.backupData();
                })
                .catch((error) => {
                    console.log('Error selecting random data: ' + error)
                    this.setState({
                        loading: false,
                        myData: this.newRecord()
                    })
                    this.backupData();
                });
        }
    }
    backupData = () => {
        this.myDataBU = JSON.parse(JSON.stringify(this.state.myData));
    }
    setAllowSave = () => {
        let edited = (JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU));
        this.setState({
            allowSave: edited && (this.state.myData["ket_tagihan"] !== "")
        });
    }
    setAllowRincian = () => {
        this.setState({
            allowRincian: (this.state.myData["ket_tagihan"] !== "")
        });
    }


}




const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },

    ActivityIndicator: {
        width: '100%',
    },
    ActivityIndicatorText: {
        width: '100%',
        textAlign: 'center'
    },
    input: {
        width: Global.getScreenWidth() - 20,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    }

});

AppRegistry.registerComponent('ScreenTagihanEdit', () => ScreenTagihanEdit);
export default ScreenTagihanEdit;