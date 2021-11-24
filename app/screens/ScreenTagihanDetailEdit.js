import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';
import MyFunctions from '../functions/MyFunctions';





class ScreenTagihanDetailEdit extends Component {

    constructor(props) {

        super(props);
        //alert(props.route.params.mode);
        let ind = props.route.params.myDataDetIndex;
        let data = props.route.params.myData;
        console.log(data["det_array"].length);
        if (ind >= data["det_array"].length) {
            data["det_array"].push(this.newRecord());
            ind = data["det_array"].length;
        }
        this.state = {
            loading: false,
            myDataDetIndex: ind,
            myData: data,
            myDataDetToDelete: props.route.params.myDataDetToDelete
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
        //console.log(this.state.myData["det_array"].length);
        return (

            <View style={styles.MainContainer}>
                <View style={styles.ContentContainer}>
                    <View style={{ margin: 5 }}>
                        <Text>{this.state.myData['ket_tagihan']}</Text>
                        <Text>Total (bruto) : </Text>
                    </View>
                    <View style={{ margin: 5, flexGrow: 1 }}>
                        <View style={{ flex: 1 }}>

                            <PagerView style={styles.viewPager} initialPage={this.state.myDataDetIndex} >
                                {this.state.myData["det_array"].map(this.renderSwipeView)}
                            </PagerView>
                        </View>
                    </View>
                    <View style={{ margin: 5 }}>
                        <Button
                            title={'Selesai'}
                            style={styles.input}
                            onPress={this.loadData}
                        />
                    </View>





                </View>
                <View style={styles.LoadingContainer}>
                    <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                    {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}
                </View>
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
        //console.log(this.state.myData["nm_item"]);
        this.setState({ myData: this.state.myData });
    }
    renderSwipeView = (data, index, me) => {
        return (
            <View style={styles.page} key={"view" + data["id_det_item"]}>
                <Button
                    key={"btn" + data["id_det_item"]}
                    title={(data["id_item"] === undefined || data["id_item"] === "") ? "Pilih Item" : data["nm_item"]}
                    style={styles.input}
                    onPress={() => this.props.navigation.navigate('Item', { myParentData: this.state.myData, mode: "lookup", myParentDataDetIndex: index })}
                />
                <TextInput
                    key={"txt_qty" + data["id_det_item"]}
                    value={data['qty']}
                    onChangeText={(qty) => {
                        qty = MyFunctions.validateNumber(qty);
                        let arr = this.state.myData;
                        arr["det_array"][index]['qty'] = qty;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Jumlah'}
                    //secureTextEntry={true}
                    style={styles.input}
                    keyboardType="numeric"
                    numeric
                />
                <TextInput
                    key={"txt_harga" + data["id_det_item"]}
                    value={data['harga']}
                    onChangeText={(harga) => {
                        harga = MyFunctions.validateNumber(harga);
                        let arr = this.state.myData;
                        arr["det_array"][index]['harga'] = harga;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Harga'}
                    //secureTextEntry={true}
                    style={styles.input}
                    keyboardType="numeric"
                    numeric
                />
                <TextInput
                    key={"txt_ket_det_item" + data["id_det_item"]}
                    value={data['ket_det_item']}
                    onChangeText={(ket_det_item) => {
                        ket_det_item = MyFunctions.validateString(ket_det_item);
                        let arr = this.state.myData;
                        arr["det_array"][index]['ket_det_item'] = ket_det_item;
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Keterangan'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <Text>{index > 0 && index < me.length - 1 ? "◀ Swipe ▶" : index > 0 ? "◀ Swipe" : "Swipe ▶"}</Text>
            </View>
        );
    }


}




const styles = StyleSheet.create({

    MainContainer: {
        margin: 1,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },

    ContentContainer: {
        width: '100%',
        height: '100%',
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
    },
    viewPager: {
        flex: 1,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },

});

AppRegistry.registerComponent('ScreenTagihanDetailEdit', () => ScreenTagihanDetailEdit);
export default ScreenTagihanDetailEdit;