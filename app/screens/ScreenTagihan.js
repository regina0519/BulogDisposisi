import React, { Component } from 'react';
import MyFunctions from './../functions/MyFunctions';
import { AppRegistry, StyleSheet, FlatList, Text, View, ActivityIndicator, Platform, TouchableOpacity, TouchableHighlightComponent, RefreshControl } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import MyServerSettings from '../functions/MyServerSettings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';
import { StackActions } from '@react-navigation/routers';



class ScreenTagihan extends Component {
  keyExtractor = (data, index) => data.id_tagihan;

  constructor(props) {

    super(props);

    this.state = {
      loading: true,
      myData: [],
      page: 1
    }
  }



  loadMoreData = () => {
    this.setState({
      page: this.state.page + 1
    }, () => this.loadData(true))
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
          refreshControl={
            <RefreshControl refreshing={this.state.loading} onRefresh={this.refreshData} />
          }
        />
        <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
        <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Tambah Tagihan')}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={50}
            color={DefaultTheme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    )
  }

  refreshData = () => {
    this.setState({
      loading: true,
      myData: [],
      page: 1
    });
    this.loadData();
  }

  loadData = (more = false) => {
    this.setState({ loading: true })
    let url = MyServerSettings.getPhp("get_list_ongoing.php") + '?res=10&pg=' + this.state.page;
    //let url = MyServerSettings.getPhp("test.php") + '?res=10&pg=' + this.state.page;
    //console.log(url);
    fetch(url)
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
        if (more) this.setState({ page: this.state.page - 1 })
      });
  }

  componentDidMount() {
    this.loadData()
  }

  renderDataItem = ({ item, index }) => {

    /*return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { id: item.id })}>
        <Text>{item.id}</Text>
        <Text>{item.data_string}</Text>
        <Text>{item.data_double}</Text>
        <Text>{item.data_datetime}</Text>
      </TouchableOpacity>
    )*/
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { id: item.id_tagihan })}>
        <Text>{moment(item.tgl_pembuatan).locale("id").format("llll")}</Text>
        <Text>{item.ket_tagihan}</Text>
        <Text>{item.ketdet}</Text>
        <Text>{"Rp. " + MyFunctions.formatMoney(item.total)}</Text>
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
  },

  AddButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0

  }

});

AppRegistry.registerComponent('ScreenTagihan', () => ScreenTagihan);
export default ScreenTagihan;