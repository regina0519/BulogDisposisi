import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, ImageBackground, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';



class ScreenAdminFungsi extends Component {

    keyExtractor = (data, index) => data.id_fungsi;


    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            myData: []
        }
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
                                rightOpenValue={0}
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
        let url = MyServerSettings.getPhp("get_list_fungsi.php");
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
        this.loadData()
        this.focusListener = this.props.navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            this.refreshData();

        });
    }

    onRowDidOpen = rowKey => {

    };

    renderHiddenItem = (data, rowMap) => (
        <View style={
            [
                Global.customStyles.rowBack,
                {
                    backgroundColor: Global.getFungsiColor(this.state.myData[data.index]["id_fungsi"]),
                    margin: 10,
                    borderRadius: 25
                }
            ]

        }
        >

        </View>
    );

    renderDataItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={Global.customStyles.ListItem} onPress={() => this.props.navigation.navigate('Edit Fungsi', {
                myData: this.state.myData[index]
            })}>
                <View style={{ flexDirection: 'row' }}>
                    <MaterialCommunityIcons
                        name="badge-account-horizontal"
                        size={50}
                        color={Global.getFungsiColor(item.id_fungsi)}
                        style={{ alignSelf: 'center' }}
                    />
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>{item.fungsi_disposisi}</Text>
                        <Text style={{ paddingHorizontal: 5 }}>{item.ket_fungsi}</Text>
                    </View>
                </View>
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
        justifyContent: 'center'
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

AppRegistry.registerComponent('ScreenAdminFungsi', () => ScreenAdminFungsi);
export default ScreenAdminFungsi;