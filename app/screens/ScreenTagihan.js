import React, { Component } from 'react';
import MyFunctions from './../functions/MyFunctions';
import { AppRegistry, ImageBackground, StyleSheet, Alert, Text, View, ActivityIndicator, Platform, TouchableOpacity, TouchableHighlightComponent, RefreshControl, Image, ToastAndroid, BackHandler } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import MyServerSettings from '../functions/MyServerSettings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';
import { StackActions } from '@react-navigation/routers';
import Global from '../functions/Global';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AnimatedCircularProgress } from 'react-native-circular-progress';



class ScreenTagihan extends Component {
  keyExtractor = (data, index) => data.id_tagihan;

  constructor(props) {

    super(props);

    this.state = {
      loading: true,
      myData: [],
      exiting: false,
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
                leftOpenValue={75}
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={this.onRowDidOpen}
                keyExtractor={this.keyExtractor}
                style={{ width: '100%' }}
                onEndReachedThreshold={0.1}
                onEndReached={this.loadMoreData}
                refreshControl={
                  <RefreshControl refreshing={false} onRefresh={this.refreshData} />
                }
              />
              {
                Global.getIdFungsi() == "FUNGSI_001" ? (
                  <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Edit Tagihan', {
                    idTagihan: ""
                  })} disabled={this.state.loading}>
                    <MaterialCommunityIcons
                      name="plus-circle"
                      size={50}
                      color={'#101417'}
                    />
                  </TouchableOpacity>
                ) : (null)
              }
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
    let url = MyServerSettings.getPhp("get_list_ongoing.php") + '?res=10&pg=' + this.state.page + "&fungsi=" + Global.getIdFungsi() + "&person=" + Global.getCurUserId() + "&bid=" + Global.getIdBidang();
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
  backAction = () => {
    if (!this.props.navigation.canGoBack()) {
      if (this.state.exiting)
        return false;
      this.setState({ exiting: true });
      setTimeout(() => {
        this.setState({ exiting: false });
      }, 3000);
      ToastAndroid.show("Tekan sekali lagi untuk keluar!", ToastAndroid.SHORT);
      return true;
    }
  };
  componentDidMount() {
    this.loadData();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.refreshData();
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
    });
  }

  deleteRow = (rowMap, rowKey) => {
    let arr = this.state.myData;

    Alert.alert("Konfirmasi!", "Hapus Tagihan '" + arr[rowKey]["no_nota_intern"] + "'?", [
      {
        text: "Batal",
        onPress: () => null,
        style: "cancel"
      },
      {
        text: "Ya", onPress: () => {
          fetch(MyServerSettings.getPhp("delete_tagihan.php") + '?id=' + arr[rowKey]["id_tagihan"])
            .then((response) => response.json())
            .then((responseJson) => {
              var res = responseJson[0];
              console.log(res);
              if (res["succeed"] == "1") {
                alert("Tagihan '" + arr[rowKey]["no_nota_intern"] + "' telah dihapus.");
              } else {
                if (res["error"] == "EXIST") {
                  alert("Maaf, Tagihan '" + arr[rowKey]["no_nota_intern"] + "' tidak bisa dihapus karena sedang dalam proses pencairan.");
                } else {
                  alert("Error Koneksi");
                }
              }
            }).then(this.refreshData)
            .catch((error) => {
              console.log('Error selecting random data: ' + error)
              alert("Error Koneksi Jaringan");
            });
        }
      }
    ]);

  };
  progressRow = (rowMap, rowKey) => {
    this.props.navigation.navigate('Progres Tagihan', { myData: this.state.myData[rowKey] });
  };
  onRowDidOpen = rowKey => {
    //console.log('This row opened', rowKey);
  };

  renderHiddenItem = (data, rowMap) => (
    <View style={Global.customStyles.rowBack}>
      <TouchableOpacity
        style={[Global.customStyles.backRightBtn, Global.customStyles.backRightBtnLeft]}
        onPress={() => this.progressRow(rowMap, data.index)}
      >
        <MaterialCommunityIcons
          name="chart-timeline-variant"
          size={30}
          color='#101417'
        />
        <Text style={{ color: '#101417' }}>Progres</Text>
      </TouchableOpacity>
      {
        Global.getIdFungsi() == "FUNGSI_001" ? (
          <View style={[Global.customStyles.backRightBtn, Global.customStyles.backRightBtnRight, { flexDirection: 'row', width: 150, justifyContent: 'space-evenly' }]}>
            <TouchableOpacity
              onPress={() => this.deleteRow(rowMap, data.index)}
              style={{ marginHorizontal: 5, alignItems: 'center' }}
              disabled={this.state.myData[data.index]["status_pembuatan"] == "0" && this.state.myData[data.index]["status_tagihan"] == "" ? false : true}
            >
              <MaterialCommunityIcons
                name="delete"
                size={30}
                color={this.state.myData[data.index]["status_pembuatan"] == "0" ? '#101417' : '#AAAAAA'}
              />
              <Text style={{ color: this.state.myData[data.index]["status_pembuatan"] == "0" && this.state.myData[data.index]["status_tagihan"] == "" ? '#101417' : '#AAAAAA' }}>Hapus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Edit Tagihan', {
                idTagihan: this.state.myData[data.index]["id_tagihan"]
              })}
              style={{ marginHorizontal: 5, alignItems: 'center' }}
              disabled={this.state.myData[data.index]["status_pembuatan"] == "0" ? false : true}
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={30}
                color={this.state.myData[data.index]["status_pembuatan"] == "0" ? '#101417' : '#AAAAAA'}
              />
              <Text style={{ color: this.state.myData[data.index]["status_pembuatan"] == "0" ? '#101417' : '#AAAAAA' }}>Ubah</Text>
            </TouchableOpacity>
          </View>
        ) : (null)
      }
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
      <TouchableOpacity style={Global.customStyles.ListItem} onPress={() => this.props.navigation.navigate('Disposisi Tagihan', {
        idTagihan: item.id_tagihan
      })}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ padding: 5, justifyContent: 'center', width: '20%' }}>
            {
              this.getPercentage(item).status != 2 ?
                <View>
                  <AnimatedCircularProgress
                    size={50}
                    width={10}
                    fill={this.getPercentage(item).percent}
                    tintColor="#03428B"
                    onAnimationComplete={null}
                    backgroundColor="#aaaaaa">
                    {
                      () => (
                        <Text style={{ fontSize: 10 }}>
                          {this.getPercentage(item).percent + "%"}
                        </Text>

                      )
                    }
                  </AnimatedCircularProgress>
                  {
                    this.getPercentage(item).status == 1 ?
                      <View style={{ position: 'absolute', top: -5, right: 0, backgroundColor: "#FF0000", borderRadius: 25, padding: 3 }}>
                        <MaterialCommunityIcons
                          name="file-document-edit-outline"
                          size={20}
                          color={'#FFFFFF'}
                          style={{}}
                        />
                      </View> : null
                  }
                </View>

                :
                <Image
                  source={require('../assets/rejected.png')}
                  style={{ width: 50, height: 50 }}
                />
            }

          </View>
          <View style={{ width: '80%' }}>
            <Text style={{ textAlign: 'right', fontSize: 10 }}>{moment(item.tgl_pembuatan).locale("id").format("llll")}</Text>
            <Text style={{ textAlign: 'right', fontSize: 10, fontWeight: 'bold' }}>{item.no_nota_intern}</Text>
            <Text style={{ fontWeight: 'bold', color: this.getPercentage(item).status == 2 ? "#FF0000" : "#000000" }}>{item.ket_tagihan}</Text>
            <Text style={{ textAlign: 'left' }}>Bidang {item.nm_bidang}</Text>
            <Text style={{ fontSize: 10 }}>{MyFunctions.stringTruncateIndo(item.ketdet, 2, '\n', 'item')}</Text>
            <Text style={{ textAlign: 'right', fontWeight: 'bold', color: this.getPercentage(item).status == 2 ? "#FF0000" : "#000000" }}>{"Rp. " + MyFunctions.formatMoney(item.total)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  getPercentage = (item) => {
    if (item.status_tagihan == "COMPLETED") return { status: 0, percent: 100 };
    if (item.status_tagihan == "FAILED") return { status: 2, percent: 0 };
    var p = 0;
    p += (item.status_pembuatan % 3) < 2 ? item.status_pembuatan % 3 * 10 : 0;
    p += (item.status_pengajuan % 3) < 2 ? item.status_pengajuan % 3 * 10 : 0;
    p += (item.status_approval_kakanwil % 3) < 2 ? item.status_approval_kakanwil % 3 * 20 : 0;
    p += (item.status_approval_minkeu % 3) < 2 ? item.status_approval_minkeu % 3 * 20 : 0;
    p += (item.status_verifikasi % 3) < 2 ? item.status_verifikasi % 3 * 20 : 0;
    p += (item.status_approval_bagkeu % 3) < 2 ? item.status_approval_bagkeu % 3 * 20 : 0;
    return { status: item.status_tagihan == "EDITING" ? 1 : 0, percent: p }
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