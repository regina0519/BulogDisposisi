import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, ImageBackground, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyFunctions from '../functions/MyFunctions';





class ScreenItemAdd extends Component {

    constructor(props) {

        super(props);
        //alert(props.route.params.mode);
        this.state = {
            loading: false,
            myParentData: props.route.params.myParentData,
            myData: [{
                'id_item': '',
                'nm_item': '',
                'satuan': '',
                'harga_patokan': '0',
                'ket_item': ''
            }],
            myResult: []
        }


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
                                <Text style={Global.customStyles.Label}>Item</Text>
                                <TextInput
                                    value={this.state.myData[0]['nm_item']}
                                    onChangeText={(nm_item) => {
                                        nm_item = MyFunctions.validateString(nm_item);
                                        let arr = this.state.myData;
                                        arr[0]['nm_item'] = nm_item;
                                        this.setState({ myData: arr });
                                    }}
                                    placeholder={'Item'}
                                    //secureTextEntry={true}
                                    style={Global.customStyles.Input}
                                />
                                <Text style={Global.customStyles.Label}>Satuan</Text>
                                <TextInput
                                    value={this.state.myData[0]['satuan']}
                                    onChangeText={(satuan) => {
                                        satuan = MyFunctions.validateString(satuan);
                                        let arr = this.state.myData;
                                        arr[0]['satuan'] = satuan;
                                        this.setState({ myData: arr });
                                    }}
                                    placeholder={'Satuan'}
                                    //secureTextEntry={true}
                                    style={Global.customStyles.Input}
                                />
                                <Text style={Global.customStyles.Label}>Standar Harga</Text>
                                <TextInput
                                    value={this.state.myData[0]['harga_patokan']}
                                    onChangeText={(harga_patokan) => {
                                        harga_patokan = MyFunctions.validateInputDouble(harga_patokan);
                                        let arr = this.state.myData;
                                        arr[0]['harga_patokan'] = harga_patokan;
                                        this.setState({ myData: arr });
                                    }}
                                    placeholder={'Standar Harga'}
                                    //secureTextEntry={true}
                                    style={Global.customStyles.Input}
                                    keyboardType="numeric"
                                    numeric
                                />
                                <Text style={Global.customStyles.Label}>Keterangan</Text>
                                <TextInput
                                    value={this.state.myData[0]['ket_item']}
                                    onChangeText={(ket_item) => {
                                        ket_item = MyFunctions.validateString(ket_item);
                                        let arr = this.state.myData;
                                        arr[0]['ket_item'] = ket_item;
                                        this.setState({ myData: arr });
                                    }}
                                    placeholder={'Keterangan'}
                                    //secureTextEntry={true}
                                    style={Global.customStyles.Input}
                                />
                            </View>

                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>
                            <Button
                                title={'Simpan'}
                                color='#101417'
                                style={styles.input}
                                onPress={this.saveItem}
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

    validData = () => {
        if (this.state.myData.length == 0) return false;
        if (this.state.myData[0]['nm_item'] == "") {
            alert("Nama item tidak valid");
            return false;
        }
        if (this.state.myData[0]['satuan'] == "") {
            alert("Satuan tidak valid");
            return false;
        }
        let hrg = Number.parseFloat(this.state.myData[0]['harga_patokan']);
        if (isNaN(hrg) || hrg <= 0) {
            alert("Standar harga tidak valid");
            return false;
        }
        return true;
    }

    saveItem = () => {
        if (!this.validData()) return;
        this.setState({ loading: true })
        //this.tmpPass = this.state.txtPass;
        fetch(
            MyServerSettings.getPhp("add_item.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.myData[0]),
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
    }
    componentDidMount() {

    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
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

AppRegistry.registerComponent('ScreenItemAdd', () => ScreenItemAdd);
export default ScreenItemAdd;