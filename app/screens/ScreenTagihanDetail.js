import React, { Component } from 'react';
import MyFunctions from './../functions/MyFunctions';
import { AppRegistry, StyleSheet, FlatList, Text, View, ActivityIndicator, Platform, TouchableOpacity, TouchableHighlightComponent } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import MyServerSettings from '../functions/MyServerSettings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from '@react-navigation/native';
import { StackActions } from '@react-navigation/routers';



class ScreenTagihanDetail extends Component {
    keyExtractor = (data, index) => data.id_tagihan;

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            myParentData: props.route.params.myParentData,
            myData: []
        }
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
                <TouchableOpacity style={styles.AddButton} onPress={() => this.props.navigation.navigate('Tambah Detail Tagihan', { myParentData: this.state.myData })}>
                    <MaterialCommunityIcons
                        name="file-plus"
                        size={50}
                        color={DefaultTheme.colors.primary}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    loadData = () => {
        //this.setState({ loading: true })
        //let arr = this.state.myData;
        //arr[0]['ket_tagihan'] = "CCCCCCCC";
        //this.setState({ myData: arr });

    }

    componentDidMount() {
        this.loadData();
    }

    renderDataItem = ({ item, index }) => {

        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail', { id: item.id_tagihan })}>
                <Text>{moment(item.tgl_pembuatan).locale("id").format("llll")}</Text>
                <Text>{item.ket_tagihan}</Text>
                <Text>{item.ketdet}</Text>
                <Text>{MyFunctions.formatMoney(item.total)}</Text>
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

AppRegistry.registerComponent('ScreenTagihanDetail', () => ScreenTagihanDetail);
export default ScreenTagihanDetail;