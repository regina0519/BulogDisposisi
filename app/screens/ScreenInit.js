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
      .then(this.readUser)
      .then(this.readPass)
      .then(this.gotoLogin)
      .catch((error) => {
        //alert(error);
        console.log('Error selecting random data: ' + error)
        this.setState({ loading: false })
      });
  }
  readCred = () => {
    Global.setUserKey(this.state.myData[0]['app_user_key']);
    Global.setPassKey(this.state.myData[0]['app_pass_key']);
    //console.log(Global.getUserKey() + "         " + Global.getPassKey());
  }
  gotoLogin = () => {
    //console.log(this.state.user + "         " + this.state.password);
    if (this.state.user === "" || this.state.password === "") {
      this.props.navigation.dispatch(StackActions.replace('Login'));
      //this.props.navigation.dispatch(StackActions.replace('Home'));

    } else {
      this.uploadData();
    }
  }

  uploadData = () => {
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
        alert("Gagal login otomatis.");
        this.setState({ loading: false })
        this.props.navigation.dispatch(StackActions.replace('Login'));
      });
  }

  login = () => {
    Global.setUser(this.state.myData[0]);
  }

  gotoTagihan = () => {
    this.props.navigation.dispatch(StackActions.replace('Home'))
  }








  readUser = async () => {
    try {
      const value = await AsyncStorage.getItem(Global.getUserKey());
      if (value !== null) {
        // value previously stored
        this.setState({ user: value });
        //console.log("read value: " + value);
      } else {
        this.setState({ user: '' });
        //console.log("read value null");
      }
    } catch (e) {
      // error reading value
      this.setState({ user: '' });
      //console.log("read error");
    }
  }
  readPass = async () => {
    try {
      const value = await AsyncStorage.getItem(Global.getPassKey());
      if (value !== null) {
        // value previously stored
        this.setState({ password: value });
        //console.log("read value: " + value);
      } else {
        this.setState({ password: '' });
        //console.log("read value null");
      }
    } catch (e) {
      // error reading value
      this.setState({ password: '' });
      //console.log("read error");
    }
  }


  componentDidMount() {
    this.loadData();
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