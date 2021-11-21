import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';





class ScreenTagihanAdd extends Component {

    constructor(props) {

        super(props);
        //console.log('jojojojojoj');
        //alert(props.route.params.mode);
        this.state = {
            loading: false,
            myData: [{
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
            }]
        }

    }



    render() {
        //console.log(JSON.stringify(this.state.myData));
        alert("rendered");
        return (

            <View style={styles.MainContainer}>
                <TextInput
                    value={this.state.myData[0]['ket_tagihan']}
                    onChangeText={(ket_tagihan) => {
                        console.log(JSON.stringify(this.state.myData));
                    }}
                    /*onChangeText={(ket_tagihan) => {
                        let arr = [...this.state.myData];
                        arr[0] = { ...arr[0], 'ket_tagihan': ket_tagihan };
                        this.setState({ myData: arr });
                    }}*/
                    placeholder={'Uraian'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData[0]['cat_pembuat']}
                    onChangeText={(cat_pembuat) => {
                        let arr = [...this.state.myData];
                        arr[0] = { ...arr[0], 'cat_pembuat': cat_pembuat };
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Catatan'}
                    //secureTextEntry={true}
                    style={styles.input}
                />

                <Button
                    title={'Lanjut'}
                    style={styles.input}
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
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    }

});

AppRegistry.registerComponent('ScreenTagihanAdd', () => ScreenTagihanAdd);
export default ScreenTagihanAdd;