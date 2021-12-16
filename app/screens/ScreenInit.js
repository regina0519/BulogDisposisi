import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, Platform, StyleSheet, Text, View } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import MyFunctions from '../functions/MyFunctions';






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
        console.log('Error selecting random data: ' + error)
        this.setState({ loading: false })
      });
  }
  readCred = () => {
    Global.setUserKey(this.state.myData[0]['app_user_key']);
    Global.setPassKey(this.state.myData[0]['app_pass_key']);
  }
  gotoLogin = () => {
    if (this.state.user === "" || this.state.password === "") {
      this.props.navigation.dispatch(StackActions.replace('Login'));

    } else {
      this.uploadData();
    }
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
        MyFunctions.msgBox("Gagal login otomatis.");
        this.setState({ loading: false })
        this.props.navigation.dispatch(StackActions.replace('Login'));
      });
  }

  login = () => {
    Global.setUser(this.state.myData[0]);
  }

  gotoTagihan = () => {
    this.props.navigation.dispatch(StackActions.replace('Bulog'))
  }








  readUser = async () => {
    try {
      const value = await AsyncStorage.getItem(Global.getUserKey());
      if (value !== null) {
        // value previously stored
        this.setState({ user: value });
      } else {
        this.setState({ user: '' });
      }
    } catch (e) {
      // error reading value
      this.setState({ user: '' });
    }
  }
  readPass = async () => {
    try {
      const value = await AsyncStorage.getItem(Global.getPassKey());
      if (value !== null) {
        // value previously stored
        this.setState({ password: value });
      } else {
        this.setState({ password: '' });
      }
    } catch (e) {
      // error reading value
      this.setState({ password: '' });
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