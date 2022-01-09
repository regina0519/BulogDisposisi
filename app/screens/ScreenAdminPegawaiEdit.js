import { Picker } from '@react-native-picker/picker';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, AppRegistry, BackHandler, Button, ImageBackground, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';
import MyFunctions from '../functions/MyFunctions';
import MyServerSettings from '../functions/MyServerSettings';






class ScreenAdminPegawaiEdit extends Component {
    myDataBU = [];
    adding = false;
    constructor(props) {

        super(props);
        this.adding = props.route.params.adding;
        let data = props.route.params.myData;
        if (data == null) data = this.newRecord();
        this.state = {
            loading: false,
            myData: data,
            myJab: [],
            myResult: [],
            allowSave: false
        }
        this.backupData();

    }

    newRecord = () => {
        return ({
            'id_pegawai': '',
            'id_jab': '',
            'nm_pegawai': '',
            'password': '',
            'tipe_user': 'Pengguna',
            'ganti_pass': '0',
            'aktif': '1',
            'id_bidang': '',
            'id_fungsi': '',
            'nm_jab': '',
            'singk_jab': '',
            'adalah_kepala_bidang': '0',
            'fungsi_disposisi': '',
            'ket_fungsi': '',
            'nm_bidang': ''
        });
    }

    render() {
        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default.jpg')}>
                <View style={styles.MainContainer}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5 }}>
                            <View style={{ flexDirection: 'row', margin: 2, padding: 2, backgroundColor: "#FFFFFF", elevation: 2, alignSelf: 'center' }}>
                                <View style={{ alignItems: 'center', width: '20%', justifyContent: 'center', borderWidth: 0, borderRadius: 5, backgroundColor: Global.getFungsiColor(this.state.myData["id_fungsi"]) }}>
                                    <MaterialCommunityIcons
                                        name={this.state.myData["adalah_kepala_bidang"] == 1 ? "account-star" : "account"}
                                        size={30}
                                        color="#FFFFFF"
                                        style={{ alignSelf: 'center', textAlign: 'center' }}
                                    />
                                    <Text style={{ fontSize: 10, textAlign: 'center', color: "#FFFFFF", fontWeight: 'bold' }}>{this.state.myData["fungsi_disposisi"]}</Text>
                                </View>

                                <View style={{ padding: 5, justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'left', fontSize: 12, color: Global.getFungsiColor(this.state.myData["id_fungsi"]) }}>{this.state.myData["nm_pegawai"]}</Text>
                                    <Text style={{ fontSize: 12 }}>{this.state.myData["id_pegawai"]}</Text>
                                    <Text style={{ fontSize: 10 }}>{this.state.myData["nm_jab"]}</Text>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{this.state.myData["id_bidang"] == "" ? "" : "Bidang " + this.state.myData["nm_bidang"]}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'center' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10 }]}>
                                <ScrollView style={{ width: '100%', paddingHorizontal: 10 }}>
                                    <Text style={Global.customStyles.Label}>ID Pegawai</Text>
                                    <TextInput
                                        value={this.state.myData['id_pegawai']}
                                        onChangeText={(id_pegawai) => {
                                            id_pegawai = MyFunctions.validateInputNumbersOnly(id_pegawai);
                                            let arr = this.state.myData;
                                            arr['id_pegawai'] = id_pegawai;
                                            this.setState({ myData: arr });
                                            this.setAllowSave();
                                        }}
                                        placeholder={'ID Pegawai'}
                                        style={Global.customStyles.Input}
                                        maxLength={9}
                                        keyboardType="numeric"
                                        numeric
                                    />
                                    <Text style={Global.customStyles.Label}>Nama</Text>
                                    <TextInput
                                        value={this.state.myData['nm_pegawai']}
                                        onChangeText={(nm_pegawai) => {
                                            nm_pegawai = MyFunctions.validateString(nm_pegawai);
                                            let arr = this.state.myData;
                                            arr['nm_pegawai'] = nm_pegawai;
                                            this.setState({ myData: arr });
                                            this.setAllowSave();
                                        }}
                                        placeholder={'Nama'}
                                        style={Global.customStyles.Input}
                                    />

                                    <Text style={Global.customStyles.Label}>Jabatan</Text>
                                    <View style={[Global.customStyles.PickerContainer, { borderColor: '#a8a8a8', marginBottom: 10 }]}>
                                        <Picker
                                            selectedValue={this.state.myData["id_jab"]}
                                            onValueChange={(itemValue, itemIndex) => {
                                                let arr = this.state.myData;
                                                arr['id_jab'] = itemValue;
                                                this.state.myJab.map((item) => {
                                                    if (item.id_jab == itemValue) {
                                                        arr['id_bidang'] = item.id_bidang == null ? "" : item.id_bidang;
                                                        arr['id_fungsi'] = item.id_fungsi;
                                                        arr['nm_jab'] = item.nm_jab;
                                                        arr['singk_jab'] = item.singk_jab;
                                                        arr['adalah_kepala_bidang'] = item.adalah_kepala_bidang;
                                                        arr['fungsi_disposisi'] = item.fungsi_disposisi;
                                                        arr['ket_fungsi'] = item.ket_fungsi;
                                                        arr['nm_bidang'] = item.nm_bidang == null ? "" : item.nm_bidang;
                                                    }
                                                })
                                                this.setState({ myData: arr });
                                                this.setAllowSave();
                                            }
                                            }>
                                            {
                                                this.state.myJab.map((item) => {
                                                    return (<Picker.Item label={item.singk_jab + "\n(" + (item.nm_bidang == null ? "Non-Bidang" : item.nm_bidang) + ")"} value={item.id_jab} key={item.id_jab} style={{ fontSize: 15 }} />);
                                                })
                                            }

                                        </Picker>
                                    </View>

                                    <Text style={Global.customStyles.Label}>Hak Akses</Text>
                                    <View style={[Global.customStyles.PickerContainer, { borderColor: '#a8a8a8', marginBottom: 10 }]}>
                                        <Picker
                                            selectedValue={this.state.myData["tipe_user"]}
                                            onValueChange={(itemValue, itemIndex) => {
                                                let arr = this.state.myData;
                                                arr['tipe_user'] = itemValue;
                                                this.setState({ myData: arr });
                                                this.setAllowSave();
                                            }
                                            }>
                                            <Picker.Item label="Pengguna" value="Pengguna" key="Pengguna" style={{ fontSize: 15 }} />
                                            <Picker.Item label="Administrator" value="Admin" key="Admin" style={{ fontSize: 15 }} />

                                        </Picker>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Pegawai Aktif</Text>
                                        <Switch
                                            trackColor={{ false: '#a8a8a8', true: '#a8a8a8' }}
                                            thumbColor={this.state.myData["aktif"] == 1 ? '#000000' : '#989898'}
                                            onValueChange={() => {
                                                var b = this.state.myData["aktif"] == 1;
                                                b = !b;
                                                let arr = this.state.myData;
                                                arr['aktif'] = b ? "1" : "0";
                                                this.setState({ myData: arr });
                                                this.setAllowSave();
                                            }}
                                            value={this.state.myData["aktif"] == 1}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Alert.alert("Konfirmasi?", "Kata Sandi akan diatur ulang ke: 'ID-Pegawai'. Lanjutkan?", [
                                                {
                                                    text: "Batal",
                                                    onPress: () => null,
                                                    style: "cancel"
                                                },
                                                {
                                                    text: "Ya", onPress: () => {
                                                        let arr = this.state.myData;
                                                        arr['password'] = "";
                                                        this.setState({ myData: arr });
                                                        this.setAllowSave();
                                                    }
                                                }
                                            ]);
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <MaterialCommunityIcons
                                                name="lock-reset"
                                                size={30}
                                                color={'#101417'}
                                                style={{ alignSelf: 'center' }}
                                            />
                                            <Text style={{ alignSelf: 'center', paddingLeft: 5, fontWeight: 'bold' }}>Atur Ulang Kata Sandi</Text>
                                        </View>
                                    </TouchableOpacity>



                                </ScrollView>
                            </View>

                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>
                            <Button
                                title={'Simpan'}
                                color='#101417'
                                style={styles.input}
                                onPress={this.save}
                                disabled={!this.state.allowSave}
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

    loadDataJabatan = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_jabatan.php?bid=all");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myJab: responseJson
                })
            })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });
    }


    save = () => {
        this.setState({ loading: true })
        fetch(
            this.adding ? MyServerSettings.getPhp("post_pegawai_add.php") : MyServerSettings.getPhp("post_pegawai.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: "[" + JSON.stringify(this.state.myData) + "]",
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
    componentDidMount() {
        this.loadDataJabatan();
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    backAction = () => {
        if ((JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU))) {
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
        } else {
            this.props.navigation.goBack();
        }

        return true;
    };
    backupData = () => {
        this.myDataBU = JSON.parse(JSON.stringify(this.state.myData));
    }
    setAllowSave = () => {
        console.log(JSON.stringify(this.state.myData) + "\n\n\n\n\n");
        let edited = (JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU));
        this.setState({
            allowSave: edited &&
                (
                    this.state.myData["id_pegawai"] !== ""
                    && this.state.myData["nm_pegawai"] !== ""
                    && this.state.myData["id_jab"] !== ""
                    && this.state.myData["tipe_user"] !== ""
                    && this.state.myData["id_pegawai"].length == 9
                )
        });
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
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    }

});

AppRegistry.registerComponent('ScreenAdminPegawaiEdit', () => ScreenAdminPegawaiEdit);
export default ScreenAdminPegawaiEdit;