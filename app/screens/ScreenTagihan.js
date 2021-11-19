import React, { Component } from 'react';
import MyFunctions from './../functions/MyFunctions';
import { AppRegistry, StyleSheet, FlatList, Text, View, Alert, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import DateIndonesia from '../functions/DateIndonesia';
import moment from 'moment/min/moment-with-locales';
import MyServerSettings from '../functions/MyServerSettings';



class ScreenTagihan extends Component {
  keyExtractor = (data, index) => data.id;

  constructor(props) {

    super(props);

    this.state = {
      loading: true,
      myData: [],
      loadingExtraData: false,
      page: 1
    }
  }



  loadMoreData = () => {
    //Alert.alert(this.state.page+'');
    this.setState({
      page: this.state.page + 1
    }, () => this.loadData())
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  }

  render() {

    return (
      <View style={styles.MainContainer}>
        <FlatList
          data={this.state.myData}
          style={{ width: 350, height: 800 }}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={this.renderDataItem}
          keyExtractor={this.keyExtractor}
          onEndReachedThreshold={0.1}
          onEndReached={this.loadMoreData}
        />
        <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
      </View>
    )
  }

  loadData = () => {
    this.setState({ loading: true })
    fetch(MyServerSettings.getPhpTest() + '?res=10&pg=' + this.state.page)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          myData: this.state.page === 1 ? responseJson : [...this.state.myData, ...responseJson]
        })
      })
      .catch((error) => {
        console.log('Error selecting random data: ' + error)
        this.setState({ loading: false })
      });
  }

  componentDidMount() {
    this.loadData()
  }

  renderDataItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { id: item.id })}>
        <Text>{item.id}</Text>
        <Text>{item.data_string}</Text>
        <Text>{MyFunctions.formatMoney(item.data_double)}</Text>
        <Text>{moment(item.data_datetime).locale("id").format("llll")}</Text>
      </TouchableOpacity>
    )
  }
}



const styles = StyleSheet.create({

  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
  },

  FlatListItemStyle: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },

  ActivityIndicator: {
    position: 'absolute',
    width: '100%'
  }

});

AppRegistry.registerComponent('ScreenTagihan', () => ScreenTagihan);
export default ScreenTagihan;