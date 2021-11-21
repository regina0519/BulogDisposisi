import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';





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

            <View style={styles.MainContainer}>
                <TextInput
                    value={this.state.myData[0]['nm_item']}
                    onChangeText={(nm_item) => {
                        let arr = this.state.myData;
                        arr[0]['nm_item'] = nm_item;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Item'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData[0]['satuan']}
                    onChangeText={(satuan) => {
                        let arr = this.state.myData;
                        arr[0]['satuan'] = satuan;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Satuan'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData[0]['harga_patokan']}
                    onChangeText={(harga_patokan) => {
                        let arr = this.state.myData;
                        arr[0]['harga_patokan'] = harga_patokan;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Patokan Harga'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData[0]['ket_item']}
                    onChangeText={(ket_item) => {
                        let arr = this.state.myData;
                        arr[0]['ket_item'] = ket_item;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Keterangan'}
                    //secureTextEntry={true}
                    style={styles.input}
                />

                <Button
                    title={'Simpan'}
                    style={styles.input}
                    onPress={this.saveItem}
                />
                <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}

            </View>
        )

    }


    saveItem = () => {
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
        justifyContent: 'center',
        flex: 1,
        margin: 10,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    ItemLookup: {
        justifyContent: 'center',
        margin: 10,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        alignSelf: 'center'
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