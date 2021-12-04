import React, { Component } from 'react';
import MyFunctions from './../functions/MyFunctions';
import { AppRegistry, ImageBackground, StyleSheet, FlatList, Text, View, ActivityIndicator, Platform, TouchableOpacity, TouchableHighlightComponent, RefreshControl, Image } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import MyServerSettings from '../functions/MyServerSettings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';
import { StackActions } from '@react-navigation/routers';
import Global from '../functions/Global';
import { SwipeListView } from 'react-native-swipe-list-view';



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
      <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/invoice.jpeg')}>
        <View style={styles.MainContainer}>
          <View style={styles.ContentContainer}>
            <View style={{ margin: 5 }}>

            </View>
            <View style={{ margin: 5, flexGrow: 1, flexShrink: 1 }}>
              <SwipeListView
                data={this.state.myData}
                renderItem={this.renderDataItem}
                renderHiddenItem={this.renderHiddenItem}
                leftOpenValue={0}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={this.onRowDidOpen}
                keyExtractor={this.keyExtractor}
                style={{ width: '100%' }}
                onEndReachedThreshold={0.1}
                onEndReached={this.loadMoreData}
                refreshControl={
                  <RefreshControl refreshing={this.state.loading} onRefresh={this.refreshData} />
                }
              />
              <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Edit Tagihan', {
                idTagihan: ""
              })} disabled={this.state.loading}>
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={50}
                  color={'#101417'}
                />
              </TouchableOpacity>
            </View>
            <View style={{ width: '50%', alignSelf: 'center' }}>

            </View>





          </View>
          <View style={styles.LoadingContainer}>
            <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
            {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}
          </View>

        </View>
      </ImageBackground>
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

  deleteRow = (rowMap, rowKey) => {
    //console.log('This row opened', rowKey);

  };
  onRowDidOpen = rowKey => {
    //console.log('This row opened', rowKey);
  };

  renderHiddenItem = (data, rowMap) => (
    <View style={Global.customStyles.rowBack}>
      <TouchableOpacity
        style={[Global.customStyles.backRightBtn, Global.customStyles.backRightBtnRight]}
        onPress={() => this.deleteRow(rowMap, data.index)}
      >
        <MaterialCommunityIcons
          name="delete"
          size={30}
          color='#101417'
        />
        <Text style={{ color: '#101417' }}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );

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
      <TouchableOpacity style={Global.customStyles.ListItem} onPress={() => this.props.navigation.navigate('Edit Tagihan', {
        idTagihan: item.id_tagihan
      })}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Image
              source={require('../assets/progress_circle/080.png')}
              style={{ width: 30, height: 30 }}
            />
          </View>
          <View>
            <Text style={{ textAlign: 'right' }}>Bidang {item.nm_bidang}</Text>
            <Text style={{ textAlign: 'right' }}>{moment(item.tgl_pembuatan).locale("id").format("llll")}</Text>
            <Text style={{ fontWeight: 'bold' }}>{item.ket_tagihan}</Text>
            <Text>{MyFunctions.stringTruncateIndo(item.ketdet, 2, '\n', 'item')}</Text>
            <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>{"Rp. " + MyFunctions.formatMoney(item.total)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}



const styles = StyleSheet.create({

  MainContainer: {
    //justifyContent: 'center',
    //flex: 1,
    //alignContent: 'flex-start',
    margin: 1,
    //paddingTop: (Platform.OS === 'ios') ? 20 : 0,
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
    //borderWidth: 5
  },

  FlatListItemStyle: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },

  ActivityIndicator: {
    width: '100%',
  },
  ActivityIndicatorText: {
    width: '100%',
    textAlign: 'center'
  },

  AddButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0

  }

});

AppRegistry.registerComponent('ScreenTagihan', () => ScreenTagihan);
export default ScreenTagihan;