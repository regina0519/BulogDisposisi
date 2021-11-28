import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';





class ScreenInit extends Component {


  constructor(props) {

    super(props);

    this.state = {
      loading: true,
      myData: [],
      user: '',
      password: ''
    }
  }



  render() {
    return (

      <View style={styles.MainContainer}>
        <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
        {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}
      </View>
    )

  }


  loadData = () => {
    this.setState({ loading: true })
    fetch(MyServerSettings.getPhp("get_app_settings.php"))
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          myData: responseJson
        })
      })
      .then(this.readCred)
      .then(this.gotoLogin)
      .catch((error) => {
        alert(error);
        console.log('Error selecting random data xxx: ' + error)
        this.setState({ loading: false })
      });
  }
  readCred = () => {
    Global.setUserKey(this.state.myData[0]['app_user_key']);
    Global.setPassKey(this.state.myData[0]['app_pass_key']);
    //alert(Global.getUserKey() + "         " + Global.getPassKey());
    this.readData(Global.getUserKey(), 'user');
    this.readData(Global.getPassKey(), 'password');
  }
  gotoLogin = () => {
    //alert(this.state.user + "         " + this.state.password);
    if (this.state.user === "" || this.state.password === "") {
      //this.props.navigation.dispatch(StackActions.replace('Login'));
      this.props.navigation.dispatch(StackActions.replace('Home'));

    } else {
      alert(this.state.user + "         " + this.state.password);
    }
  }
  readData = async (key, _var) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        // value previously stored
        this.setState({ _var: value });
      } else {
        this.setState({ _var: null });
      }
    } catch (e) {
      // error reading value
    }
  }





  componentDidMount() {
    this.loadData();
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

AppRegistry.registerComponent('ScreenInit', () => ScreenInit);
export default ScreenInit;