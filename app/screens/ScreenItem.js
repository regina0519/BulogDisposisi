import React, { Component } from 'react';
import MyFunctions from './../functions/MyFunctions';
import { AppRegistry, StyleSheet, FlatList, Text, View, ActivityIndicator, Platform, TouchableOpacity, TouchableHighlightComponent, RefreshControl, TextInput, Button } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import MyServerSettings from '../functions/MyServerSettings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme, useFocusEffect } from '@react-navigation/native';
import { StackActions } from '@react-navigation/routers';



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
            <View style={styles.MainContainer}>
                <View style={styles.ItemFilter}>
                    <TextInput
                        value={this.state.filter}
                        onChangeText={(filter) => {
                            this.setState({ filter: filter });
                        }}
                        placeholder={'Cari...'}
                        style={styles.input}
                    //secureTextEntry={true}
                    />
                    <Button
                        title={'Go'}
                        onPress={this.filterData}
                    />
                </View>
                <FlatList
                    data={this.state.myData}
                    style={{ width: 350, height: 800 }}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={this.renderDataItem}
                    keyExtractor={this.keyExtractor}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.loadMoreData}
                    refreshControl={
                        <RefreshControl refreshing={this.state.loading} onRefresh={this.refreshData} />
                    }
                />
                <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Tambah Item', { MyParentData: this.state.myData })}>
                    <MaterialCommunityIcons
                        name="plus-circle"
                        size={50}
                        color={DefaultTheme.colors.primary}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    refreshData = () => {
        this.setState({
            loading: true,
            myData: [],
            loadingExtraData: false,
            page: 1,
            //filter: ''
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
        //alert("mounted");
        //const { navigation } = this.props;
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
            <TouchableOpacity onPress={() => {
                if (this.mode === "view") {
                    this.props.navigation.navigate('Detail', { id: item.id_tagihan })
                } else {
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

}



const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    ItemFilter: {
        flexDirection: 'row',
        alignSelf: 'center',
        padding: 10
    },

    FlatListItemStyle: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },

    ActivityIndicator: {
        position: 'absolute',
        width: '100%'
    },

    AddButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0

    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        marginRight: 5,
        borderWidth: 1,
        borderColor: 'black',
    }

});

AppRegistry.registerComponent('ScreenItem', () => ScreenItem);
export default ScreenItem;