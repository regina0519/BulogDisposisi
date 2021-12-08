import React, { Component } from 'react';
import { AppRegistry, ImageBackground, ScrollView, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenTagihan from './ScreenTagihan';
import TestNotif from './TestNotif';
import ScreenProfil from './ScreenProfil';
import ScreenAdmin from './ScreenAdmin';
import BackgroundProcess from '../functions/BackgroundProcess';

const Tab = createBottomTabNavigator();

class ScreenMain extends Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: false,
            myData: [],
            user: '',
            password: ''
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

    componentDidMount() {
        let b = new BackgroundProcess();
        b.checkStatusAsync().then((status) => {
            console.log("Status: " + status["status"]);
            console.log("Regitered: " + status["isRegistered"]);
        });


        this.props.navigation.setOptions({
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../assets/favicon.png')}
                        style={{ width: 30, height: 30 }}
                    />
                    <Text style={{ fontWeight: 'bold', color: '#03428B', fontSize: 25, paddingLeft: 5 }}>Bulog</Text>
                    <Text style={{ fontWeight: 'bold', color: '#03428B', fontSize: 12, paddingLeft: 3, paddingBottom: 5, alignSelf: 'flex-end' }}>Disposisi & e-Verify</Text>

                </View>

            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Notifikasi')}
                >
                    <MaterialCommunityIcons
                        name="bell-outline"
                        size={25}
                        color={'#03428B'}
                        style={{ alignSelf: 'center' }}
                    />
                    <View style={{ borderRadius: 25, backgroundColor: "#FF0000", padding: 3, position: 'absolute', bottom: 10, left: 10 }}>
                        <Text
                            style={{ fontSize: 9, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', paddingHorizontal: 1 }}
                        >1</Text>
                    </View>
                </TouchableOpacity>
            )
        });
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

