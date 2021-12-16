import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, FlatList, ImageBackground, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import MyFunctions from './../functions/MyFunctions';



class ScreenItem extends Component {
    mode = "view";
    keyExtractor = (data, index) => data.id_item;


    constructor(props) {

        super(props);
        this.mode = props.route.params.mode;
        this.state = {
            loading: true,
            myParentData: props.route.params.myParentData,
            myParentDataDetIndex: props.route.params.myParentDataDetIndex,
            myData: [],
            loadingExtraData: false,
            page: 1,
            filter: ''
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
            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default.jpg')}>
                <View style={styles.MainContainer}>
                    <View style={styles.ContentContainer}>
                        <View style={{ margin: 5 }}>
                            <View style={styles.ItemFilter}>
                                <TextInput
                                    value={this.state.filter}
                                    onChangeText={(filter) => {
                                        this.setState({ filter: filter });
                                    }}
                                    placeholder={'Cari...'}
                                    style={[Global.customStyles.Input, { width: '60%', margin: 2, marginBottom: 2 }]}
                                />
                                <TouchableOpacity style={{ margin: 2 }} onPress={this.filterData}
                                    disabled={this.state.loading}
                                >
                                    <MaterialCommunityIcons
                                        name="magnify"
                                        size={40}
                                        color={'#101417'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1 }}>
                            <FlatList
                                data={this.state.myData}
                                renderItem={this.renderDataItem}
                                keyExtractor={this.keyExtractor}
                                onEndReachedThreshold={0.1}
                                onEndReached={this.loadMoreData}
                                refreshControl={
                                    <RefreshControl refreshing={this.state.loading} onRefresh={this.refreshData} />
                                }
                            />
                            <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Tambah Item', { MyParentData: this.state.myData })}
                                disabled={this.state.loading}
                            >
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
            loadingExtraData: false,
            page: 1,
        });
        this.loadData();
    }
    filterData = () => {
        this.setState({
            loading: true,
            myData: [],
            loadingExtraData: false,
            page: 1
        });
        this.loadData();
    }

    loadData = (more = false) => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_item.php") + '?fltr=' + this.state.filter + '&res=10&pg=' + this.state.page;
        console.log(url);
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
        this.loadData()
        this.focusListener = this.props.navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            this.refreshData();
        });

    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    renderDataItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={[Global.customStyles.ListItem, styles.FlatListItemStyle]} onPress={() => {
                if (this.mode === "view") {
                    this.props.navigation.navigate('Detail', { id: item.id_tagihan })
                } else {
                    let foundInd = this.findDetItemIndexById(item.id_item);
                    console.log("found index: " + foundInd);
                    if (foundInd < 0) {
                        let arr = this.state.myParentData;
                        arr["det_array"][this.state.myParentDataDetIndex]['id_item'] = item.id_item;
                        arr["det_array"][this.state.myParentDataDetIndex]['qty'] = '1';
                        arr["det_array"][this.state.myParentDataDetIndex]['harga'] = item.harga_patokan;
                        arr["det_array"][this.state.myParentDataDetIndex]['ket_det_item'] = "";
                        arr["det_array"][this.state.myParentDataDetIndex]['nm_item'] = item.nm_item;
                        arr["det_array"][this.state.myParentDataDetIndex]['satuan'] = item.satuan;
                        arr["det_array"][this.state.myParentDataDetIndex]['harga_patokan'] = item.harga_patokan;
                        arr["det_array"][this.state.myParentDataDetIndex]['ket_item'] = item.ket_item;
                        this.setState({ myParentData: arr });
                    } else {
                        MyFunctions.msgBox(item.nm_item + " sudah ada.");
                        let arr = this.state.myParentData;
                        if (arr["det_array"][this.state.myParentDataDetIndex]["id_item"] === "") {
                            arr["det_array"].splice(this.state.myParentDataDetIndex, 1);
                            this.setState({ myParentData: arr, myParentDataDetIndex: foundInd });
                        }
                        this.props.route.params.onReturn(foundInd);
                    }

                    this.props.navigation.goBack();
                }
            }}>
                <Text>{item.nm_item}</Text>
                <Text>{"Satuan: " + item.satuan}</Text>
                <Text>{"Patokan Harga: Rp. " + MyFunctions.formatMoney(item.harga_patokan)}</Text>
                <Text>{"Ket: " + ((item.ket_item === '') ? '-' : item.ket_item)}</Text>
            </TouchableOpacity>
        )
    }

    findDetItemIndexById(id) {
        return this.state.myParentData["det_array"].findIndex((currentValue, index, arr) => {
            return currentValue["id_item"] === id;
        });
    }


}



const styles = StyleSheet.create({

    MainContainer: {
        margin: 1,
        padding: 5,

    },

    ContentContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        padding: 5,
        elevation: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    LoadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
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
        fontSize: 18,
    },
    ItemFilter: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        width: '100%'
    },



});

AppRegistry.registerComponent('ScreenItem', () => ScreenItem);
export default ScreenItem;