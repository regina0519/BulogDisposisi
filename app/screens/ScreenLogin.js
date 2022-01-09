import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, Button, ImageBackground, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import MyFunctions from '../functions/MyFunctions';






class ScreenLogin extends Component {

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

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_login.jpg')}>
                <View style={[styles.MainContainer, { paddingTop: '20%' }]}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5, padding: 10 }}>
                            <MaterialCommunityIcons
                                name="key-variant"
                                size={50}
                                color={'#101417'}
                                style={{ alignSelf: 'center' }}
                            />
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'flex-start' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10, backgroundColor: '#FFFFFF' }]}>
                                <ScrollView style={{ width: '100%', paddingHorizontal: 10 }}>
                                    <Text style={Global.customStyles.Label}>ID Pegawai</Text>
                                    <TextInput
                                        value={this.state.user}
                                        onChangeText={(user) => this.setState({ user })}
                                        placeholder={'ID Pegawai'}
                                        style={Global.customStyles.Input}
                                    />
                                    <Text style={Global.customStyles.Label}>Kata Sandi</Text>
                                    <TextInput
                                        value={this.state.password}
                                        onChangeText={(password) => this.setState({ password })}
                                        placeholder={'Kata Sandi'}
                                        secureTextEntry={true}
                                        style={Global.customStyles.Input}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>
                            <Button
                                title={'Masuk'}
                                color='#101417'
                                style={styles.input}
                                onPress={this.uploadData}
                            />
                        </View>



                    </View>
                    <View style={styles.LoadingContainer}>
                        <ActivityIndicator style={[styles.ActivityIndicator, { elevation: this.state.loading ? 3 : 0 }]} size='large' color="red" animating={this.state.loading} />
                        {this.state.loading ? <Text style={[styles.ActivityIndicatorText, { elevation: this.state.loading ? 3 : 0 }]}>Loading... Mohon Tunggu</Text> : null}
                    </View>

                </View>
            </ImageBackground>




        )

    }


    uploadData = () => {
        this.setState({ loading: true })
        fetch(
            MyServerSettings.getPhp("get_login_info.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user": this.state.user,
                    "pass": this.state.password
                }),
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myData: responseJson
                })
            })
            .then(this.login)
            .then(this.gotoTagihan)
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                MyFunctions.msgBox("Mohon periksa kembali ID Pegawai/Kata Sandi anda.")
                this.setState({ loading: false })
            });
    }

    login = () => {
        Global.setUser(this.state.myData[0]);
        this.storeUser(this.state.user)
            .then(this.storePass(this.state.password));
    }

    gotoTagihan = () => {
        this.props.navigation.dispatch(StackActions.replace('Bulog'))
    }

    storeUser = async (value) => {
        try {
            //await AsyncStorage.setItem(Global.getUserKey(), Global.getCurUserId())
            await AsyncStorage.setItem(Global.getUserKey(), value)
        } catch (e) {
            // saving error
            console.log("write error");
        }
    }
    storePass = async (value) => {
        try {
            //await AsyncStorage.setItem(Global.getUserKey(), Global.getCurUserId())
            await AsyncStorage.setItem(Global.getPassKey(), value)
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

AppRegistry.registerComponent('ScreenLogin', () => ScreenLogin);
export default ScreenLogin;