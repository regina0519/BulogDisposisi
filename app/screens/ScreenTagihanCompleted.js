import React, { Component } from 'react';
import MyFunctions from './../functions/MyFunctions';
import { AppRegistry, ImageBackground, StyleSheet, Alert, Text, View, ActivityIndicator, Platform, TouchableOpacity, TouchableHighlightComponent, RefreshControl, Image } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import MyServerSettings from '../functions/MyServerSettings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';
import { StackActions } from '@react-navigation/routers';
import Global from '../functions/Global';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';



class ScreenTagihanCompleted extends Component {
    keyExtractor = (data, index) => data.id_tagihan;

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            myData: [],
            page: 1
        }
    }





    loadMoreData = () => {
        this.setState({
            page: this.state.page + 1
        }, () => this.loadData(true))
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
                                leftOpenValue={75}
                                rightOpenValue={-150}
                                previewRowKey={'0'}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                onRowDidOpen={this.onRowDidOpen}
                                keyExtractor={this.keyExtractor}
                                style={{ width: '100%' }}
                                onEndReachedThreshold={0.1}
                                onEndReached={this.loadMoreData}
                                refreshControl={
                                    <RefreshControl refreshing={false} onRefresh={this.refreshData} />
                                }
                            />
                            {
                                Global.getIdFungsi() == "FUNGSI_001" ? (
                                    <TouchableOpacity style={styles.AddButton} onPress={null} disabled={this.state.loading}>
                                        <MaterialCommunityIcons
                                            name="printer"
                                            size={50}
                                            color={'#101417'}
                                        />
                                    </TouchableOpacity>
                                ) : (null)
                            }
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
    }

    loadData = (more = false) => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_riwayat.php") + '?res=10&pg=' + this.state.page + "&fungsi=" + Global.getIdFungsi() + "&person=" + Global.getCurUserId() + "&bid=" + Global.getIdBidang();
        //console.log(url);
        //let url = MyServerSettings.getPhp("test.php") + '?res=10&pg=' + this.state.page;
        //console.log(url);
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myData: this.state.page === 1 ? responseJson : [...this.state.myData, ...responseJson]
                })
            })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
                if (more) this.setState({ page: this.state.page - 1 })
            });
    }

    componentDidMount() {
        this.loadData();
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.refreshData();

        });
    }

    loadHtmlNI = (idTagihan) => {
        //console.log("XXXXXX");
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("report_ni.php") + "?id=" + idTagihan;
        fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                this.print(responseText);
                //console.log(responseText);
            })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });
    }

    loadHtmlBayar = (idTagihan) => {
        //console.log("XXXXXX");
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("report_bayar.php") + "?id=" + idTagihan;
        fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                this.print(responseText);
                //console.log(responseText);
            })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });
    }

    print = async (myHtml) => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        await Print.printAsync({
            html: myHtml
        });
    }

    printNI = (rowMap, rowKey) => {
        this.loadHtmlNI(this.state.myData[rowKey]["id_tagihan"]);
    };
    printBayar = (rowMap, rowKey) => {
        this.loadHtmlBayar(this.state.myData[rowKey]["id_tagihan"]);
    };
    progressRow = (rowMap, rowKey) => {
        this.props.navigation.navigate('Progres Tagihan', { myData: this.state.myData[rowKey] });
    };
    onRowDidOpen = rowKey => {
        //console.log('This row opened', rowKey);
    };

    renderHiddenItem = (data, rowMap) => (
        <View style={Global.customStyles.rowBack}>
            <TouchableOpacity
                style={[Global.customStyles.backRightBtn, Global.customStyles.backRightBtnLeft]}
                onPress={() => this.progressRow(rowMap, data.index)}
            >
                <MaterialCommunityIcons
                    name="chart-timeline-variant"
                    size={30}
                    color='#101417'
                />
                <Text style={{ color: '#101417' }}>Alur Proses</Text>
            </TouchableOpacity>
            {
                Global.getIdFungsi() == "FUNGSI_001" ? (
                    <View style={[Global.customStyles.backRightBtn, Global.customStyles.backRightBtnRight, { flexDirection: 'row', width: 150, justifyContent: 'space-evenly' }]}>
                        <TouchableOpacity
                            onPress={() => this.printNI(rowMap, data.index)}
                            style={{ marginHorizontal: 5, alignItems: 'center' }}
                            disabled={this.state.myData[data.index]["status_tagihan"] == "COMPLETED" ? false : true}
                        >
                            <MaterialCommunityIcons
                                name="printer"
                                size={30}
                                color={this.state.myData[data.index]["status_tagihan"] == "COMPLETED" ? '#101417' : '#AAAAAA'}
                            />
                            <Text style={{ textAlign: 'center', color: this.state.myData[data.index]["status_tagihan"] == "COMPLETED" ? '#101417' : '#AAAAAA' }}>Nota{"\n"}Intern</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.printBayar(rowMap, data.index)}
                            style={{ marginHorizontal: 5, alignItems: 'center' }}
                            disabled={this.state.myData[data.index]["status_tagihan"] == "COMPLETED" ? false : true}
                        >
                            <MaterialCommunityIcons
                                name="printer"
                                size={30}
                                color={this.state.myData[data.index]["status_tagihan"] == "COMPLETED" ? '#101417' : '#AAAAAA'}
                            />
                            <Text style={{ textAlign: 'center', color: this.state.myData[data.index]["status_tagihan"] == "COMPLETED" ? '#101417' : '#AAAAAA' }}>Bukti{"\n"}Bayar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (null)
            }
        </View>
    );

    renderDataItem = ({ item, index }) => {

        /*return (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { id: item.id })}>
            <Text>{item.id}</Text>
            <Text>{item.data_string}</Text>
            <Text>{item.data_double}</Text>
            <Text>{item.data_datetime}</Text>
          </TouchableOpacity>
        )*/
        return (
            <TouchableOpacity style={Global.customStyles.ListItem} onPress={() => this.props.navigation.navigate('Disposisi Tagihan', {
                idTagihan: item.id_tagihan
            })}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 5, justifyContent: 'center', width: '20%' }}>
                        {
                            item.status_tagihan == "COMPLETED" ? (
                                <MaterialCommunityIcons
                                    name="check"
                                    size={50}
                                    color={'#00FF00'}
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="close"
                                    size={50}
                                    color={'#FF0000'}
                                />
                            )
                        }

                    </View>
                    <View style={{ width: '80%' }}>
                        <Text style={{ textAlign: 'right', fontSize: 10 }}>{moment(item.tgl_pembuatan).locale("id").format("llll")}</Text>
                        <Text style={{ textAlign: 'right', fontSize: 10, fontWeight: 'bold' }}>{item.no_nota_intern}</Text>
                        <Text style={{ fontWeight: 'bold', color: this.getPercentage(item).status == 2 ? "#FF0000" : "#000000" }}>{item.ket_tagihan}</Text>
                        <Text style={{ textAlign: 'left' }}>Bidang {item.nm_bidang}</Text>
                        <Text style={{ fontSize: 10 }}>{MyFunctions.stringTruncateIndo(item.ketdet, 2, '\n', 'item')}</Text>
                        <Text style={{ textAlign: 'right', fontWeight: 'bold', color: this.getPercentage(item).status == 2 ? "#FF0000" : "#000000" }}>{"Rp. " + MyFunctions.formatMoney(item.total)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    getPercentage = (item) => {
        if (item.status_tagihan == "COMPLETED") return { status: 0, percent: 100 };
        if (item.status_tagihan == "FAILED") return { status: 2, percent: 0 };
        var p = 0;
        p += (item.status_pembuatan % 3) < 2 ? item.status_pembuatan % 3 * 10 : 0;
        p += (item.status_pengajuan % 3) < 2 ? item.status_pengajuan % 3 * 10 : 0;
        p += (item.status_approval_kakanwil % 3) < 2 ? item.status_approval_kakanwil % 3 * 20 : 0;
        p += (item.status_approval_minkeu % 3) < 2 ? item.status_approval_minkeu % 3 * 20 : 0;
        p += (item.status_verifikasi % 3) < 2 ? item.status_verifikasi % 3 * 20 : 0;
        p += (item.status_approval_bagkeu % 3) < 2 ? item.status_approval_bagkeu % 3 * 20 : 0;
        return { status: item.status_tagihan == "EDITING" ? 1 : 0, percent: p }
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

AppRegistry.registerComponent('ScreenTagihanCompleted', () => ScreenTagihanCompleted);
export default ScreenTagihanCompleted;