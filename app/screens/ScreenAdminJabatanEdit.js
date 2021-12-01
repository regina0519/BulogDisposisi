import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, Switch, ImageBackground, BackHandler, Alert, ScrollView, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyFunctions from '../functions/MyFunctions';
import { Picker } from '@react-native-picker/picker';





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
            'nm_bidang': ''
        });
    }

    render() {
        //console.log(JSON.stringify(this.state.myData));
        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/invoice.jpeg')}>
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
                                        //secureTextEntry={true}
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
                                        placeholder={'Singkatan Jabatan'}
                                        //secureTextEntry={true}
                                        style={Global.customStyles.Input}
                                    />
                                    <Text style={Global.customStyles.Label}>Bidang</Text>
                                    <View style={{ borderRadius: 20, borderWidth: 2, padding: 5, borderColor: '#a8a8a8' }}>
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
                                                    return (<Picker.Item label={item.nm_bidang} value={item.id_bidang} key={item.id_bidang} />);
                                                })
                                            }

                                        </Picker>
                                    </View>
                                    <Text style={Global.customStyles.Label}>Fungsi</Text>
                                    <View style={{ borderRadius: 20, borderWidth: 2, padding: 5, borderColor: '#a8a8a8' }}>
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
                                                    //console.log(item.id_fungsi);
                                                    return (<Picker.Item label={item.fungsi_disposisi} value={item.id_fungsi} key={item.id_fungsi} />);
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
        //let url = MyServerSettings.getPhp("test.php") + '?res=10&pg=' + this.state.page;
        //console.log(url);
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
        //this.tmpPass = this.state.txtPass;
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





        //this.props.navigation.dispatch(StackActions.replace('Item'))

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
        //console.log(JSON.stringify(this.state.myData));
        let edited = (JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU));
        //console.log(JSON.stringify(this.state.myData) + "\n\n\n\n\n" + JSON.stringify(this.myDataBU));
        this.setState({
            allowSave: edited && (this.state.myData["nm_jab"] !== "" && this.state.myData["singk_jab"] !== "")
        });
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