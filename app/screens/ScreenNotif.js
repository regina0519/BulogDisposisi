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



class ScreenNotif extends Component {

    keyExtractor = (data, index) => data.id_notifikasi;


    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            myData: []
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
        this.loadData()
        this.focusListener = this.props.navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            this.refreshData();

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
            <TouchableOpacity style={Global.customStyles.ListItem} onPress={() => this.props.navigation.navigate('Edit Fungsi', {
                myData: this.state.myData[index]
            })}>
                <Text style={{ fontWeight: 'bold', paddingHorizontal: 5 }}>{item.notif_title}</Text>
                <Text style={{ paddingHorizontal: 5 }}>{item.notif_desc}</Text>
                <Text style={{ paddingHorizontal: 5 }}>{moment(item.tgl_notif).locale("id").format("llll")}</Text>
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

AppRegistry.registerComponent('ScreenNotif', () => ScreenNotif);
export default ScreenNotif;