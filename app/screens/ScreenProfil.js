import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restart } from 'fiction-expo-restart';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, AppRegistry, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';





class ScreenProfil extends Component {


    constructor(props) {

        super(props);
        this.state = {
            loading: false
        }


    }



    render() {
        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default_main.jpg')}>
                <View style={styles.MainContainer}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5, padding: 30 }}>
                            <MaterialCommunityIcons
                                name="badge-account-horizontal"
                                size={100}
                                color={Global.getFungsiColor(Global.getIdFungsi())}
                                style={{ alignSelf: 'center' }}
                            />
                            <Text style={{ color: Global.getFungsiColor(Global.getIdFungsi()), fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>{Global.getFungsi()}</Text>
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'flex-start' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10, backgroundColor: '#FFFFFF' }]}>
                                <Text style={{ color: Global.getFungsiColor(Global.getIdFungsi()), fontWeight: 'bold', fontSize: 18 }}>{Global.getNmPeg()}</Text>
                                <Text style={{ fontWeight: 'bold' }}>{Global.getCurUserId()}</Text>
                                <Text >{Global.getNmJab()}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Bidang {Global.getNmBidang()}</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ margin: 2 }} onPress={this.changePass}
                                disabled={this.state.loading}
                            >
                                <MaterialCommunityIcons
                                    name="key-variant"
                                    size={40}
                                    color={Global.getFungsiColor(Global.getIdFungsi())}
                                    style={{ alignSelf: 'center' }}
                                />
                                <Text style={{ color: Global.getFungsiColor(Global.getIdFungsi()), fontSize: 10, textAlign: 'center' }} > Ganti Kata Sandi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ margin: 2 }} onPress={this.logout}
                                disabled={this.state.loading}
                            >
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={40}
                                    color={Global.getFungsiColor(Global.getIdFungsi())}
                                    style={{ alignSelf: 'center' }}
                                />
                                <Text style={{ color: Global.getFungsiColor(Global.getIdFungsi()), fontSize: 10, textAlign: 'center' }} >Keluar</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                    <View style={styles.LoadingContainer}>
                        <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                        {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}
                    </View>

                </View>
            </ImageBackground >
        )

    }

    changePass = () => {
        this.props.navigation.navigate('Ganti Kata Sandi');
    }

    logout = () => {
        Alert.alert("Konfirmasi?", "Keluar dan mengulang kembali aplikasi?", [
            {
                text: "Batal",
                onPress: null,
                style: "cancel"
            },
            {
                text: "Ya", onPress: () => {
                    this.storeUser("").then(Restart());
                }
            }
        ]);
    }
    storeUser = async (value) => {
        try {
            await AsyncStorage.setItem(Global.getUserKey(), value)
        } catch (e) {
            // saving error
            console.log("write error");
        }
    }
    componentDidMount() {

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

AppRegistry.registerComponent('ScreenProfil', () => ScreenProfil);
export default ScreenProfil;