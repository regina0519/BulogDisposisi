import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';





class TestTmp extends Component {


    constructor(props) {

        super(props);

        this.state = {
            txt: "",
            saved: ""
        }
    }



    render() {
        return (

            <View style={{ justifyContent: 'center', flexDirection: 'column', height: '100%' }}>
                <Text style={{ margin: 10 }}>Test TMP</Text>
                <TextInput
                    value={this.state.txt}
                    onChangeText={(val) => {
                        this.setState({ txt: val });
                    }}
                    placeholder={"var"}
                    style={{ margin: 10, borderWidth: 1 }}
                />
                <View style={{ margin: 10 }}></View>
                <Button title={'Write'} onPress={this.writeData} style={{ margin: 10 }} />
                <View style={{ margin: 10 }}></View>
                <Button title={'Read'} onPress={this.readData} style={{ margin: 10 }} />
            </View>
        )

    }


    writeData = () => {
        this.storeVar("MYVAR", this.state.txt).then(this.readData);
    }
    readData = () => {
        this.readVar("MYVAR");
    }
    storeVar = async (key, value) => {
        try {
            //await AsyncStorage.setItem(Global.getUserKey(), Global.getCurUserId())
            await AsyncStorage.setItem(key, value)
            //this.setState({ user: value });
        } catch (e) {
            // saving error
            console.log("write error");
        }
    }
    readVar = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (value !== null) {
                // value previously stored
                //this.setState({ user: value });
                console.log("read value: " + value);
            } else {
                //this.setState({ user: '' });
                console.log("read value null");
            }
        } catch (e) {
            // error reading value
            console.log("read error");
        }
    }

    componentDidMount() {
        //this.loadData();
    }
}


AppRegistry.registerComponent('TestTmp', () => TestTmp);
export default TestTmp;