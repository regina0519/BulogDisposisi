import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';





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

            <View style={styles.MainContainer}>
                <TextInput
                    value={this.state.user}
                    onChangeText={(user) => this.setState({ user })}
                    placeholder={'ID Pegawai'}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                />

                <Button
                    title={'Login'}
                    style={styles.input}
                    onPress={this.loadData}
                />
                <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}

            </View>
        )

    }


    loadData = () => {
        this.setState({ loading: true })
        //this.tmpPass = this.state.txtPass;
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
                this.setState({ loading: false })
            });
    }

    login = () => {
        Global.setUser(this.state.myData[0]);
        this.storeKey(Global.getUserKey(), 'user', this.state.user);
        this.storeKey(Global.getPassKey(), 'password', this.state.password);

    }

    gotoTagihan = () => {
        this.props.navigation.dispatch(StackActions.replace('Home'))
    }

    async storeKey(key, _var, value) {
        try {
            //await AsyncStorage.setItem(Global.getUserKey(), Global.getCurUserId())
            await AsyncStorage.setItem(key, value)
            this.setState({ _var: value });
        } catch (e) {
            // saving error
        }
    }

    componentDidMount() {
        //this.loadData();
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

}


const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
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