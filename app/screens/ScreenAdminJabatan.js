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
import { Picker } from '@react-native-picker/picker';



class ScreenAdminJabatan extends Component {
    keyExtractor = (data, index) => data.id_jab;


    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            myData: [],
            page: 1,
            myBidang: [],
            curBidang: "all"
        }
    }





    loadMoreData = () => {
        this.setState({
            page: this.state.page + 1
        }, () => this.loadData(true))
    }

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#607D8B",
                }}
            />
        );
    }

    render() {

        return (
            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/invoice.jpeg')}>
                <View style={styles.MainContainer}>
                    <View style={styles.ContentContainer}>
                        <View style={{ margin: 5 }}>
                            <View style={{ flexDirection: 'row', padding: 2, alignItems: 'center' }}>
                                <Text style={{ width: '20%', fontWeight: 'bold' }}>Bidang </Text>
                                <View style={{ width: '80%', borderRadius: 20, borderWidth: 2, padding: 5 }}>
                                    <Picker
                                        selectedValue={this.state.curBidang}
                                        onValueChange={(itemValue, itemIndex) => {
                                            const f = async () => {
                                                this.setState({ curBidang: itemValue })
                                            }
                                            f().then(this.refreshData);
                                        }
                                        }>
                                        {
                                            this.state.myBidang.map((item) => {
                                                return (<Picker.Item label={item.nm_bidang} value={item.id_bidang} key={item.id_bidang} />);
                                            })
                                        }

                                    </Picker>
                                </View>
                            </View>
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1 }}>
                            <SwipeListView
                                data={this.state.myData}
                                renderItem={this.renderDataItem}
                                renderHiddenItem={this.renderHiddenItem}
                                leftOpenValue={0}
                                rightOpenValue={-75}
                                previewRowKey={'0'}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                onRowDidOpen={this.onRowDidOpen}
                                keyExtractor={this.keyExtractor}
                                style={{ width: '100%' }}
                                onEndReachedThreshold={0.1}
                                onEndReached={this.loadMoreData}
                                refreshControl={
                                    <RefreshControl refreshing={this.state.loading} onRefresh={this.refreshData} />
                                }
                            />
                            <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Edit Jabatan', {
                                myData: null
                            })} disabled={this.state.loading}>
                                <MaterialCommunityIcons
                                    name="plus-circle"
                                    size={50}
                                    color={'#101417'}
                                />
                            </TouchableOpacity>
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
            myData: [],
            page: 1
        });
        this.loadData();
        this.loadDataBidang();
    }



    loadData = (more = false) => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_jabatan.php") + "?bid=" + this.state.curBidang;
        //let url = MyServerSettings.getPhp("test.php") + '?res=10&pg=' + this.state.page;
        //console.log(url);
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
                if (more) this.setState({ page: this.state.page - 1 })
            });
    }

    loadDataBidang = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_bidang.php");
        //let url = MyServerSettings.getPhp("test.php") + '?res=10&pg=' + this.state.page;
        //console.log(url);
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                var arr = [{ "id_bidang": "all", "nm_bidang": "(semua)" }, { "id_bidang": "none", "nm_bidang": "(kosong)" }];
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

    componentDidMount() {
        const f = async () => {
            this.loadDataBidang
        }
        f().then(this.loadData);


        this.focusListener = this.props.navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            this.refreshData();

        });
    }

    deleteRow = (rowMap, rowKey) => {
        let arr = this.state.myData;

        Alert.alert("Konfirmasi!", "Hapus jabatan '" + arr[rowKey]["nm_jab"] + "'?", [
            {
                text: "Batal",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "Ya", onPress: () => {
                    fetch(MyServerSettings.getPhp("delete_jabatan.php") + '?id=' + arr[rowKey]["id_jab"] + '&kepala=' + arr[rowKey]["adalah_kepala_bidang"] + '&bid=' + arr[rowKey]["id_bidang"])
                        .then((response) => response.json())
                        .then((responseJson) => {
                            var res = responseJson[0];
                            console.log(res);
                            if (res["succeed"] == "1") {
                                if (res["error"] != "") {
                                    alert(res["error"]);
                                } else {
                                    alert("Jabatan '" + arr[rowKey]["nm_jab"] + "' telah dihapus.");
                                }
                            } else {
                                if (res["error"] == "EXIST") {
                                    alert("Maaf, Jabatan '" + arr[rowKey]["nm_jab"] + "' tidak bisa dihapus karena sudah digunakan.");
                                } else {
                                    alert("Error Koneksi");
                                }
                            }
                        }).then(this.refreshData)
                        .catch((error) => {
                            console.log('Error selecting random data: ' + error)
                            this.setState({
                                loading: false,
                                myData: this.newRecord()
                            })
                            this.backupData();
                        });
                }
            }
        ]);

    };



    onRowDidOpen = rowKey => {
        //console.log('This row opened', rowKey);
    };

    renderHiddenItem = (data, rowMap) => (
        <View style={Global.customStyles.rowBack}>
            <TouchableOpacity
                style={[Global.customStyles.backRightBtn, Global.customStyles.backRightBtnRight]}
                onPress={() => this.deleteRow(rowMap, data.index)}
            >
                <MaterialCommunityIcons
                    name="delete"
                    size={30}
                    color='#101417'
                />
                <Text style={{ color: '#101417' }}>Hapus</Text>
            </TouchableOpacity>
        </View>
    );

    renderDataItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={Global.customStyles.ListItem} onPress={() => this.props.navigation.navigate('Edit Jabatan', {
                myData: this.state.myData[index]
            })}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <MaterialCommunityIcons
                        name={item.adalah_kepala_bidang == 1 ? "account-star" : "account"}
                        size={30}
                        color={Global.getFungsiColor(item.id_fungsi)}
                        style={{ width: '20%', alignSelf: 'center', textAlign: 'center' }}
                    />
                    <View style={{ width: '80%', padding: 5 }}>
                        <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.singk_jab}</Text>
                        <Text style={{ textAlign: 'left' }}>{item.nm_jab}</Text>
                        <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{item.nm_bidang == null ? "(Non-Bidang)" : "Bidang " + item.nm_bidang}</Text>
                        <Text style={{ textAlign: 'center' }}>"{item.ket_fungsi}"</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
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

AppRegistry.registerComponent('ScreenAdminJabatan', () => ScreenAdminJabatan);
export default ScreenAdminJabatan;