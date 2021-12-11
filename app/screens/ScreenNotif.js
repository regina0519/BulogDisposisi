import React, { Component } from 'react';
import MyFunctions from './../functions/MyFunctions';
import { AppRegistry, ImageBackground, StyleSheet, Alert, Text, View, ActivityIndicator, Platform, TouchableOpacity, TouchableHighlightComponent, RefreshControl } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import MyServerSettings from '../functions/MyServerSettings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';
import { StackActions } from '@react-navigation/routers';
import Global from '../functions/Global';
import { SwipeListView } from 'react-native-swipe-list-view';
import { WebView } from "react-native-webview";



class ScreenNotif extends Component {

    keyExtractor = (data, index) => data.id_notifikasi;

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            myData: [],
            myResult: [],
            myTimer: []
        }
    }


    render() {

        return (
            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/invoice.jpeg')}>
                <View style={styles.MainContainer}>
                    <View style={styles.ContentContainer}>
                        <View style={{ margin: 5 }}>

                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1 }}>
                            <SwipeListView
                                data={this.state.myData}
                                renderItem={this.renderDataItem}
                                renderHiddenItem={this.renderHiddenItem}
                                leftOpenValue={0}
                                rightOpenValue={0}
                                previewRowKey={'0'}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                onRowDidOpen={this.onRowDidOpen}
                                keyExtractor={this.keyExtractor}
                                style={{ width: '100%' }}
                                refreshControl={
                                    <RefreshControl refreshing={this.state.loading} onRefresh={this.refreshData} />
                                }
                            />
                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>

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

    refreshData = () => {
        this.setState({
            loading: true,
            myData: []
        });
        this.loadData();
    }

    loadData = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_notif.php?id=" + Global.getCurUserId());
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myData: responseJson
                })
            })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });
    }




    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            this.refreshData();

        });

        this.loadTimer();
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 10, height: 10 }}>
                        <WebView
                            onMessage={() => {
                                this.updateTime()
                            }}
                            source={{
                                html: `<script>
          setInterval(()=>{window.ReactNativeWebView.postMessage("");}, ${1000})
          </script>`,
                            }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={{ backgroundColor: '#FF0000', opacity: 0 }}
                        />
                    </View>
                </View>
            )
        });
    }

    getNotifTime = (date, timer) => {
        var ket = "detik yang lalu";

        var t = moment(date).diff(timer["now"], 'seconds') * -1;
        //console.log(date + "       " + t);
        if (t > 60) {
            ket = "menit yang lalu";
            t = moment(date).diff(timer["now"], 'minutes') * -1;
            if (t > 60) {
                ket = "jam yang lalu";
                t = moment(date).diff(timer["now"], 'hours') * -1;
                if (t > 24) {
                    ket = "hari yang lalu";
                    t = moment(date).diff(timer["now"], 'days') * -1;
                    if (t > 7) {
                        ket = "";
                        t = moment(date).locale("id").format("llll")
                        return t + " " + ket;
                    } else {
                        return t + " " + ket;
                    }
                } else {
                    return t + " " + ket;
                }
            } else {
                return t + " " + ket;
            }
        } else {
            return "baru saja";
        }
    }

    updateTime = () => {
        let arr = this.state.myTimer;
        arr["now"] = moment(arr["now"]).add(1, "seconds").format("YYYY-MM-DD HH:mm:ss");
        this.setState({
            myTimer: arr
        });
    }

    loadTimer = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("now.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myTimer: responseJson[0]
                })
            })
            .catch((error) => {
                alert("Maaf, terjadi kesalahan pada koneksi jaringan.");
                console.log('Error selecting random data TIMER: ' + error)
                this.setState({ loading: false })
            });

    }

    onRowDidOpen = rowKey => {
        //console.log('This row opened', rowKey);
    };

    renderHiddenItem = (data, rowMap) => (
        <View></View>
    );

    renderDataItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={[Global.customStyles.ListItem, { backgroundColor: item.seen == 1 ? ("#FFFFFF") : ("#D3DCE3") }]} onPress={() => { this.save(index) }}>
                <Text style={{ fontWeight: 'bold', paddingHorizontal: 5, fontSize: 16 }}>{item.notif_title}</Text>
                <Text style={{ paddingHorizontal: 5 }}>{item.notif_desc}</Text>
                <Text style={{ paddingHorizontal: 5, fontSize: 10, alignSelf: 'flex-end' }}>{this.getNotifTime(item.tgl_kirim, this.state.myTimer)}</Text>
            </TouchableOpacity>
        )
    }

    save = (index) => {
        let arr = this.state.myData;
        arr[index]["seen"] = "1";
        //console.log(JSON.stringify(arr[index]));
        this.setState({ loading: true, myData: arr });
        //this.tmpPass = this.state.txtPass;
        fetch(
            MyServerSettings.getPhp("post_notif_sent.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: "[" + JSON.stringify(arr[index]) + "]",
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myResult: responseJson
                })
            })
            .then(() => { this.processResult(index) })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });





        //this.props.navigation.dispatch(StackActions.replace('Item'))
    }
    processResult = (index) => {
        if (this.state.myResult[0]['succeed']) {
            this.props.navigation.navigate('Disposisi Tagihan', {
                idTagihan: this.state.myData[index]["id_tagihan"]
            })
        } else {
            alert("Gagal menyimpan\n" + this.state.myResult[0]['error']);
        }
        //return true;
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

    FlatListItemStyle: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },

    ActivityIndicator: {
        width: '100%',
    },
    ActivityIndicatorText: {
        width: '100%',
        textAlign: 'center'
    },

    AddButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0

    }

});

AppRegistry.registerComponent('ScreenNotif', () => ScreenNotif);
export default ScreenNotif;