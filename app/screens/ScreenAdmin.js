import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, ImageBackground, ScrollView, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';





class ScreenAdmin extends Component {

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

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/invoice.jpeg')}>
                <View style={[styles.MainContainer, { paddingTop: '20%' }]}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5, padding: 10 }}>
                            <MaterialCommunityIcons
                                name="toolbox"
                                size={50}
                                color={'#101417'}
                                style={{ alignSelf: 'center' }}
                            />
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'flex-start' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10 }]}>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: 5, padding: 5, paddingLeft: 20, alignItems: 'center', borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
                                    <MaterialCommunityIcons
                                        name="account-details"
                                        size={30}
                                        color={'#101417'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ padding: 3, paddingLeft: 15, fontWeight: 'bold' }}>Pegawai</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: 5, padding: 5, paddingLeft: 20, alignItems: 'center', borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}
                                    onPress={() => this.props.navigation.navigate('Jabatan')}
                                >
                                    <MaterialCommunityIcons
                                        name="account-star"
                                        size={30}
                                        color={'#101417'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ padding: 3, paddingLeft: 15, fontWeight: 'bold' }}>Jabatan</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: 5, padding: 5, paddingLeft: 20, alignItems: 'center', borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}
                                    onPress={() => this.props.navigation.navigate('Fungsi')}
                                >
                                    <MaterialCommunityIcons
                                        name="account-check"
                                        size={30}
                                        color={'#101417'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ padding: 3, paddingLeft: 15, fontWeight: 'bold' }}>Fungsi</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: 5, padding: 5, paddingLeft: 20, alignItems: 'center', borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}
                                    onPress={() => this.props.navigation.navigate('Bidang')}
                                >
                                    <MaterialCommunityIcons
                                        name="account-group"
                                        size={30}
                                        color={'#101417'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ padding: 3, paddingLeft: 15, fontWeight: 'bold' }}>Bidang</Text>
                                </TouchableOpacity>
                            </View>
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

    componentDidMount() {
        //this.loadData();
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

AppRegistry.registerComponent('ScreenAdmin', () => ScreenAdmin);
export default ScreenAdmin;