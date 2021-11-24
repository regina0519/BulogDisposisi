import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';





class ScreenTagihanDetailAdd extends Component {

    constructor(props) {

        super(props);
        //alert(props.route.params.mode);
        this.state = {
            loading: false,
            myParentData: props.route.params.myParentData,
            myData: [{
                'id_det_item': '',
                'id_tagihan': '',
                'id_item': '',
                'qty': '0',
                'harga': '0',
                'ket_det_item': '',
                'nm_item': '',
                'satuan': '',
                'harga_patokan': '',
                'ket_item': ''
            }]
        }

    }

    refreshData = () => {
        console.log(this.state.myData[0]["nm_item"]);
        this.setState({ myData: this.state.myData });
    }



    render() {
        //console.log(JSON.stringify(this.state.myData));
        return (

            <View style={styles.MainContainer}>
                <View style={styles.ItemLookup}>
                    <Text style={{ textAlign: 'center' }}>{this.state.myData[0]['nm_item']}</Text>
                    <Button
                        title={'Pilih Item'}
                        onPress={() => this.props.navigation.navigate('Item', { myParentData: this.state.myData, mode: "lookup" })}
                    />
                </View>
                <TextInput
                    value={this.state.myData[0]['qty']}
                    onChangeText={(qty) => {
                        let arr = this.state.myData;
                        arr[0]['qty'] = qty;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Jumlah'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData[0]['harga']}
                    onChangeText={(harga) => {
                        let arr = this.state.myData;
                        arr[0]['harga'] = harga;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Harga'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData[0]['ket_det_item']}
                    onChangeText={(ket_det_item) => {
                        let arr = this.state.myData;
                        arr[0]['ket_det_item'] = ket_det_item;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Keterangan'}
                    //secureTextEntry={true}
                    style={styles.input}
                />

                <Button
                    title={'Simpan'}
                    style={styles.input}
                    onPress={this.loadData}
                />
                <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}

            </View>
        )

    }


    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            this.refreshData();
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

AppRegistry.registerComponent('ScreenTagihanDetailAdd', () => ScreenTagihanDetailAdd);
export default ScreenTagihanDetailAdd;