import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from "react-native-webview"





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
                <View style={{ width: 200, height: 200 }}>
                    <WebView
                        onMessage={() => {
                            Global.doBackground();
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
            </View>
        )

    }


    componentDidMount() {
        //this.loadData();
    }
}


AppRegistry.registerComponent('TestTmp', () => TestTmp);
export default TestTmp;