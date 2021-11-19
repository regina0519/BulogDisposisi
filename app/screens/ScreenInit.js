import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, FlatList, Text, View, Alert, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';





class ScreenInit extends Component {

  keyExtractor = (data, index) => data.id_setting;
  constructor(props) {

    super(props);

    this.state = {
      loading: true,
      myData: []
    }
  }



  render() {
    return (

      <View style={styles.MainContainer}>
        <FlatList
          data={this.state.myData}
          style={{ width: 0, height: 0 }}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={this.renderDataItem}
          keyExtractor={this.keyExtractor}
        />
        <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
        {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}

      </View>
    )
  }
  renderDataItem = ({ item, index }) => {
    Global.setUserKey(item.app_user_key);
    Global.setPassKey(item.app_pass_key);


    return (
      null
    )
  }


  loadData = async () => {
    this.setState({ loading: true })
    const response = await fetch(MyServerSettings.getPhp("get_app_settings.php"));
    const responseJson = await response.json();
    const result = await this.aaa(responseJson);
    const success = await this.bbb(result);
    return success;
  }

  async aaa(responseJson) {
    this.setState({
      loading: false,
      myData: responseJson
    });
    return this.state.myData;
  }
  async bbb(data) {
    var user = await this.getValueByKey(Global.getUserKey());
    var pass = await this.getValueByKey(Global.getPassKey());

    alert(user + "    " + pass);

    if (user != "" && pass != "") {
      //auto login
      this.props.navigation.dispatch(StackActions.replace('Tagihan'))
    } else {
      //manual login
      this.props.navigation.dispatch(StackActions.replace('Login'))
    }

    return true;
  }

  async getValueByKey(key) {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        // value previously stored
        return value;
      } else return "";
    } catch (e) {
      // error reading value
      return "";
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
  }

});

AppRegistry.registerComponent('ScreenInit', () => ScreenInit);
export default ScreenInit;