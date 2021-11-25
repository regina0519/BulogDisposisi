import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, Alert, StyleSheet, BackHandler, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';
import MyFunctions from '../functions/MyFunctions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';





class ScreenTagihanDetailEdit extends Component {


    constructor(props) {

        super(props);
        //alert(props.route.params.mode);
        let ind = props.route.params.myDataDetIndex;
        let data = props.route.params.myData;
        //console.log(data["det_array"].length);
        if (ind >= data["det_array"].length) {
            data["det_array"].push(this.newRecord());
            ind = data["det_array"].length - 1;
        }
        this.state = {
            loading: false,
            myDataDetIndex: ind,
            pagerView: React.createRef(),
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
                        <Text>Total (bruto) : Rp.{MyFunctions.formatMoney(this.countTotal())}</Text>
                    </View>
                    <View style={{ margin: 5, flexGrow: 1, flexShrink: 1 }}>
                        <View style={{ flex: 1 }}>

                            <PagerView style={styles.viewPager} initialPage={this.state.myDataDetIndex} ref={this.state.pagerView} onPageSelected={(e) => { this.setState({ myDataDetIndex: e.nativeEvent.position }); console.log("pos: " + e.nativeEvent.position); }}>
                                {this.state.myData["det_array"].map(this.renderSwipeView)}
                            </PagerView>
                        </View>
                        <View style={styles.EditControls}>
                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={this.delDetItem}>
                                <MaterialCommunityIcons
                                    name="minus-circle"
                                    size={50}
                                    color={DefaultTheme.colors.primary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={this.addDetItem}>
                                <MaterialCommunityIcons
                                    name="plus-circle"
                                    size={50}
                                    color={DefaultTheme.colors.primary}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{ margin: 5 }}>
                        <Button
                            title={'Selesai'}
                            style={styles.input}
                            onPress={this.backAction}
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

    initNewItem = async () => {
        let data = this.state.myData;
        if (data["det_array"].length > 0) {
            if (data["det_array"][data["det_array"].length - 1]["id_item"] === "") throw "not yet";
        }

        data["det_array"].push(this.newRecord());
        let ind = data["det_array"].length - 1;
        this.setState({
            myDataDetIndex: ind,
            myData: data
        });
    }

    addDetItem = () => {
        this.initNewItem().then(() => {
            this.state.pagerView.current.setPage(this.state.myDataDetIndex);
        }).catch((err) => { console.log(err) });
        //this.state.pagerView.current.setPage(this.state.myDataDetIndex);
    }
    initDelItem = async () => {
        let data = this.state.myData;
        let ind = this.state.myDataDetIndex;
        if (data["det_array"].length > 0) {
            if (data["det_array"][ind] === undefined) throw "unknown";
            if (data["det_array"][ind]["id_det_item"] !== "") {
                let bu = this.state.myDataDetToDelete;
                bu.push(data["det_array"][ind]["id_det_item"]);
                this.setState({
                    myDataDetToDelete: bu
                });
            }
            data["det_array"].splice(ind, 1);
            if (ind < data["det_array"].length - 1) {
                ind++;
            } else if (ind > 0) {
                ind--;
            }

            this.setState({
                myDataDetIndex: ind,
                myData: data
            });
        }
    }
    delDetItem = () => {
        if (this.state.myData["det_array"].length > 0) {
            this.initDelItem().then(() => {
                this.state.pagerView.current.setPage(this.state.myDataDetIndex);
            }).catch((err) => { console.log(err) });
        }

    }

    validData = () => {
        let data = this.state.myData;
        if (data["det_array"].length > 0) {
            if (data["det_array"][data["det_array"].length - 1]["id_item"] === "") {
                Alert.alert("Maaf!", "Anda belum memilih item. Selesai mengedit?", [
                    {
                        text: "Batal",
                        onPress: () => this.state.pagerView.current.setPage(data["det_array"].length - 1),
                        style: "cancel"
                    },
                    {
                        text: "Ya", onPress: () => {
                            data["det_array"].splice(data["det_array"].length - 1, 1);
                            this.props.navigation.goBack();
                        }
                    }
                ]);
            } else {
                this.props.navigation.goBack();
            }
        } else {
            this.props.navigation.goBack();
        }
    }

    backAction = () => {
        this.validData();
        return true;
    };

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={this.backAction}
                >
                    <MaterialCommunityIcons
                        name="menu-left"
                        size={40}
                        color='#101417'
                    />
                </TouchableOpacity>
            ),
        });
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.focusListener = this.props.navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            this.refreshData();

        });
    }

    requestToGoToDetIndex = (index) => {
        this.state.pagerView.current.setPage(this.state.myDataDetIndex);
        this.setState({ myDataDetIndex: index });
    }

    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }

    refreshData = () => {
        //console.log(this.state.myData["nm_item"]);
        this.setState({ myData: this.state.myData });
    }
    renderSwipeView = (data, index, me) => {

        return (
            <View style={styles.page} key={index}>
                <Button
                    title={(data["id_item"] === undefined || data["id_item"] === "") ? "Pilih Item" : data["nm_item"]}
                    style={styles.input}
                    onPress={() => this.props.navigation.navigate('Item', { myParentData: this.state.myData, mode: "lookup", myParentDataDetIndex: index, onReturn: (index) => { this.state.pagerView.current.setPage(index) } })}
                />
                <TextInput
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
                <Text>{index > 0 && index < me.length - 1 ? "◀ Swipe ▶" : index > 0 ? "◀ Swipe" : index < me.length - 1 ? "Swipe ▶" : ""}</Text>
            </View>
        );
    }

    countTotal() {
        var msgTotal = this.state.myData["det_array"].reduce(function (prev, cur) {
            return prev + (cur.qty * cur.harga);
        }, 0);
        return msgTotal;
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

    EditControls: {
        position: 'absolute',
        bottom: 0,
        padding: 10,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'

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