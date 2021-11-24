import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';





class ScreenTagihanDetailEdit2 extends Component {

    constructor(props) {

        super(props);
        //alert(props.route.params.mode);
        this.state = {
            loading: false,
            myParentData: props.route.params.myParentData,
            myData: props.route.params.myData,
            myDataToDelete: props.route.params.myDataToDelete
        }

    }

    newRecord = () => {
        return ({
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
        });
    }




    render() {
        //console.log(JSON.stringify(this.state.myData));
        return (

            <View style={styles.MainContainer}>
                <View style={styles.ItemLookup}>
                    <Text style={{ textAlign: 'center' }}>{this.state.myData['nm_item']}</Text>
                    <Button
                        title={'Pilih Item'}
                        onPress={() => this.props.navigation.navigate('Item', { myParentData: this.state.myData, mode: "lookup" })}
                    />
                </View>
                <TextInput
                    value={this.state.myData['qty']}
                    onChangeText={(qty) => {
                        let arr = this.state.myData;
                        arr['qty'] = qty;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Jumlah'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData['harga']}
                    onChangeText={(harga) => {
                        let arr = this.state.myData;
                        arr['harga'] = harga;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Harga'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData['ket_det_item']}
                    onChangeText={(ket_det_item) => {
                        let arr = this.state.myData;
                        arr['ket_det_item'] = ket_det_item;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Keterangan'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Button
                            title={'Hapus'}
                            onPress={this.loadData}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Button
                                title={'<<'}
                                onPress={this.loadData}
                            />
                            <Button
                                title={'>>'}
                                onPress={this.loadData}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button
                            title={'Tambah'}
                            onPress={this.loadData}
                        />


                    </View>
                </View>

                <View style={{ margin: 10 }}></View>
                <Button
                    title={'Selesai'}
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

    refreshData = () => {
        console.log(this.state.myData["nm_item"]);
        this.setState({ myData: this.state.myData });
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

AppRegistry.registerComponent('ScreenTagihanDetailEdit2', () => ScreenTagihanDetailEdit2);
export default ScreenTagihanDetailEdit2;