import React, { Component } from 'react';
import { ActivityIndicator, Alert, AppRegistry, ImageBackground, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import MyFunctions from '../functions/MyFunctions';



class ScreenAdminBidang extends Component {
    keyExtractor = (data, index) => data.id_bidang;

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
                            <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Edit Bidang', {
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
    }

    loadData = (more = false) => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_bidang.php") + '?res=10&pg=' + this.state.page;
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

    deleteRow = (rowMap, rowKey) => {
        let arr = this.state.myData;

        Alert.alert("Konfirmasi!", "Hapus bidang '" + arr[rowKey]["nm_bidang"] + "'?", [
            {
                text: "Batal",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "Ya", onPress: () => {
                    fetch(MyServerSettings.getPhp("delete_bidang.php") + '?id=' + arr[rowKey]["id_bidang"])
                        .then((response) => response.json())
                        .then((responseJson) => {
                            var res = responseJson[0];
                            console.log(res);
                            if (res["succeed"] == "1") {
                                MyFunctions.msgBox("Bidang '" + arr[rowKey]["nm_bidang"] + "' telah dihapus.");
                            } else {
                                if (res["error"] == "EXIST") {
                                    MyFunctions.msgBox("Maaf, Bidang '" + arr[rowKey]["nm_bidang"] + "' tidak bisa dihapus karena sudah digunakan.");
                                } else {
                                    MyFunctions.msgBox("Error Koneksi");

                                }
                            }
                        }).then(this.refreshData)
                        .catch((error) => {
                            console.log('Error selecting random data: ' + error)
                            this.setState({
                                loading: false
                            })
                        });
                }
            }
        ]);

    };



    onRowDidOpen = rowKey => {

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
            <TouchableOpacity style={Global.customStyles.ListItem} onPress={() => this.props.navigation.navigate('Edit Bidang', {
                myData: this.state.myData[index]
            })}>
                <Text style={{ fontWeight: 'bold', paddingVertical: 15, paddingHorizontal: 5 }}>{item.nm_bidang}</Text>
            </TouchableOpacity>
        )
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    LoadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
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

AppRegistry.registerComponent('ScreenAdminBidang', () => ScreenAdminBidang);
export default ScreenAdminBidang;