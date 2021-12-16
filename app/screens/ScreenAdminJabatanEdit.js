import { Picker } from '@react-native-picker/picker';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, AppRegistry, BackHandler, Button, ImageBackground, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Global from '../functions/Global';
import MyFunctions from '../functions/MyFunctions';
import MyServerSettings from '../functions/MyServerSettings';






class ScreenAdminJabatanEdit extends Component {
    myDataBU = [];
    constructor(props) {

        super(props);
        let data = props.route.params.myData;
        if (data == null) data = this.newRecord();
        this.state = {
            loading: false,
            myData: data,
            myBidang: [],
            myFungsi: [],
            myResult: [],
            allowSave: false
        }
        this.backupData();

    }

    newRecord = () => {
        return ({
            'id_jab': '',
            'id_bidang': '',
            'id_fungsi': '',
            'nm_jab': '',
            'singk_jab': '',
            'adalah_kepala_bidang': '0',
            'fungsi_disposisi': '',
            'ket_fungsi': '',
            'nm_bidang': '',
            'kode_bidang': ''
        });
    }

    render() {
        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default.jpg')}>
                <View style={styles.MainContainer}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5 }}>

                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'center' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10 }]}>
                                <ScrollView style={{ width: '100%', paddingHorizontal: 10 }}>
                                    <Text style={Global.customStyles.Label}>Jabatan</Text>
                                    <TextInput
                                        value={this.state.myData['nm_jab']}
                                        onChangeText={(nm_jab) => {
                                            nm_jab = MyFunctions.validateString(nm_jab);
                                            let arr = this.state.myData;
                                            arr['nm_jab'] = nm_jab;
                                            this.setState({ myData: arr });
                                            this.setAllowSave();
                                        }}
                                        placeholder={'Jabatan'}
                                        style={Global.customStyles.Input}
                                    />
                                    <Text style={Global.customStyles.Label}>Singkatan</Text>
                                    <TextInput
                                        value={this.state.myData['singk_jab']}
                                        onChangeText={(singk_jab) => {
                                            singk_jab = MyFunctions.validateString(singk_jab);
                                            let arr = this.state.myData;
                                            arr['singk_jab'] = singk_jab;
                                            this.setState({ myData: arr });
                                            this.setAllowSave();
                                        }}
                                        maxLength={10}
                                        placeholder={'Singkatan Jabatan'}
                                        style={Global.customStyles.Input}
                                    />
                                    <Text style={Global.customStyles.Label}>Bidang</Text>
                                    <View style={[Global.customStyles.PickerContainer, { borderColor: '#a8a8a8', marginBottom: 10 }]}>
                                        <Picker
                                            selectedValue={this.state.myData["id_bidang"] == "" ? "none" : this.state.myData["id_bidang"]}
                                            onValueChange={(itemValue, itemIndex) => {
                                                if (itemValue == "none") itemValue = "";
                                                let arr = this.state.myData;
                                                arr['id_bidang'] = itemValue;
                                                this.setState({ myData: arr });
                                                this.setAllowSave();
                                            }
                                            }>
                                            {
                                                this.state.myBidang.map((item) => {
                                                    return (<Picker.Item label={item.nm_bidang} value={item.id_bidang} key={item.id_bidang} style={{ fontSize: 15 }} />);
                                                })
                                            }

                                        </Picker>
                                    </View>
                                    <Text style={Global.customStyles.Label}>Fungsi</Text>
                                    <View style={[Global.customStyles.PickerContainer, { borderColor: '#a8a8a8', marginBottom: 10 }]}>
                                        <Picker
                                            selectedValue={this.state.myData["id_fungsi"]}
                                            onValueChange={(itemValue, itemIndex) => {
                                                let arr = this.state.myData;
                                                arr['id_fungsi'] = itemValue;
                                                this.setState({ myData: arr });
                                                this.setAllowSave();
                                            }
                                            }>
                                            {
                                                this.state.myFungsi.map((item) => {
                                                    return (<Picker.Item label={item.fungsi_disposisi} value={item.id_fungsi} key={item.id_fungsi} style={{ fontSize: 15 }} />);
                                                })
                                            }

                                        </Picker>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Kepala Bidang</Text>
                                        <Switch
                                            trackColor={{ false: '#a8a8a8', true: '#a8a8a8' }}
                                            thumbColor={this.state.myData["adalah_kepala_bidang"] == 1 ? '#000000' : '#989898'}
                                            onValueChange={() => {
                                                var b = this.state.myData["adalah_kepala_bidang"] == 1;
                                                b = !b;
                                                let arr = this.state.myData;
                                                arr['adalah_kepala_bidang'] = b ? "1" : "0";
                                                this.setState({ myData: arr });
                                                this.setAllowSave();
                                            }}
                                            value={this.state.myData["id_bidang"] == "" ? false : this.state.myData["adalah_kepala_bidang"] == 1}
                                            disabled={this.state.myData["id_bidang"] == ""}
                                        />
                                    </View>


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

    loadDataBidang = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_bidang.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                var arr = [{ "id_bidang": "none", "nm_bidang": "(kosong)" }];
                responseJson.forEach((item, index) => {
                    arr.push(item);
                });

                this.setState({
                    loading: false,
                    myBidang: arr
                })
            })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });
    }
    loadDataFungsi = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_fungsi.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myFungsi: responseJson
                })
            })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });
    }


    save = () => {
        console.log("[" + JSON.stringify(this.state.myData) + "]");
        this.setState({ loading: true })
        fetch(
            MyServerSettings.getPhp("post_jabatan.php"),
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
        this.loadDataBidang();
        this.loadDataFungsi();
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
        let edited = (JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU));
        this.setState({
            allowSave: edited && (this.state.myData["nm_jab"] !== "" && this.state.myData["singk_jab"] !== "")
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

AppRegistry.registerComponent('ScreenAdminJabatanEdit', () => ScreenAdminJabatanEdit);
export default ScreenAdminJabatanEdit;