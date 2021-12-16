import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import { AppRegistry, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from "react-native-webview";
import BackgroundProcess from '../functions/BackgroundProcess';
import Global from '../functions/Global';
import MyFunctions from '../functions/MyFunctions';
import MyServerSettings from '../functions/MyServerSettings';
import ScreenAdmin from './ScreenAdmin';
import ScreenProfil from './ScreenProfil';
import ScreenTagihan from './ScreenTagihan';
import ScreenTagihanCompleted from './ScreenTagihanCompleted';

const Tab = createBottomTabNavigator();

class ScreenMain extends Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: false,
            myNotif: []
        }
    }



    render() {
        return (
            <Tab.Navigator
                initialRouteName="Feed"
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#000000',
                }}
            >
                <Tab.Screen
                    name="TabTagihan"
                    component={ScreenTagihan}
                    options={{
                        tabBarLabel: 'Tagihan',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="view-list"
                                color={color}
                                size={size}
                            />
                        ),
                    }} />
                <Tab.Screen
                    name="TabHistory"
                    component={ScreenTagihanCompleted}
                    options={{
                        tabBarLabel: 'Riwayat',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="history"
                                color={color}
                                size={size}
                            />
                        ),
                    }} />
                {
                    Global.getTipeUser() == "Admin" ? (
                        <Tab.Screen
                            name="TabAdmin"
                            component={ScreenAdmin}
                            options={{
                                tabBarLabel: 'Pengaturan',
                                tabBarIcon: ({ color, size }) => (
                                    <MaterialCommunityIcons
                                        name="tools"
                                        color={color}
                                        size={size}
                                    />
                                ),
                            }} />
                    ) : (null)
                }
                <Tab.Screen
                    name="TabProfile"
                    component={ScreenProfil}
                    options={{
                        tabBarLabel: 'Profil',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="account"
                                color={color}
                                size={size}
                            />
                        ),
                    }} />
            </Tab.Navigator>
        );
    }

    refreshNotif = () => {
        this.setState({
            loading: true,
            myNotif: []
        });
        this.loadNotif();
    }

    loadNotif = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_notif.php?id=" + Global.getCurUserId() + "&seen=0");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myNotif: responseJson
                })
            })
            .then(() => this.setHeader())
            .catch((error) => {
                this.setState({ loading: false })
                this.setHeader();
            });
    }


    componentDidMount() {
        let b = new BackgroundProcess(this.props.navigation);
        b.checkStatusAsync().then((status) => {
            console.log("Status: " + status["status"]);
            console.log("Regitered: " + status["isRegistered"]);
        });
        this.loadNotif();
        this.props.navigation.setOptions({
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../assets/favicon.png')}
                        style={{ width: 30, height: 30 }}
                    />
                    <Text style={{ fontWeight: 'bold', color: '#03428B', fontSize: 25, paddingLeft: 5 }}>Bulog</Text>
                    <Text style={{ fontWeight: 'bold', color: '#03428B', fontSize: 12, paddingLeft: 3, paddingBottom: 5, alignSelf: 'flex-end' }}>Disposisi & Verifikasi Keuangan</Text>

                </View>

            )
        });

    }

    setHeader = () => {
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 10, height: 10 }}>
                        <WebView
                            onMessage={() => {
                                Global.doBackground();
                                this.refreshNotif();
                            }}
                            source={{
                                html: `<script>
          setInterval(()=>{window.ReactNativeWebView.postMessage("");}, ${24000})
          </script>`,
                            }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={{ backgroundColor: '#FF0000', opacity: 0 }}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Notifikasi')}
                    >
                        <MaterialCommunityIcons
                            name="bell-outline"
                            size={25}
                            color={'#03428B'}
                            style={{ alignSelf: 'center' }}
                        />
                        {
                            this.state.myNotif.length > 0 ? (
                                <View style={{ borderRadius: 25, backgroundColor: "#FF0000", padding: 3, position: 'absolute', bottom: 10, left: 10 }}>
                                    <Text
                                        style={{ fontSize: 9, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', paddingHorizontal: 1 }}
                                    >{this.state.myNotif.length > 99 ? "99+" : this.state.myNotif.length}</Text>
                                </View>
                            ) : (null)
                        }
                    </TouchableOpacity>
                </View>
            )
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
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
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    }

});

AppRegistry.registerComponent('ScreenMain', () => ScreenMain);
export default ScreenMain;

