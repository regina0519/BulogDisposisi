import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react';

import { AppRegistry, StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';





class ScreenTagihanDetailAdd extends Component {

    constructor(props) {

        super(props);
        //alert(props.route.params.mode);
        this.state = {
            loading: false,
            myParentData: props.route.params.myParentData,
            myData: []
        }

    }



    render() {
        //console.log(JSON.stringify(this.state.myData));
        return (

            <View style={styles.MainContainer}>
                <TextInput
                    value={this.state.myData[0]['ket_tagihan']}
                    onChangeText={(ket_tagihan) => {
                        let arr = [...this.state.myData];
                        arr[0] = { ...arr[0], 'ket_tagihan': ket_tagihan };
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Uraian'}
                    //secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.myData[0]['cat_pembuat']}
                    onChangeText={(cat_pembuat) => {
                        let arr = [...this.state.myData];
                        arr[0] = { ...arr[0], 'cat_pembuat': cat_pembuat };
                        this.setState({ myData: arr });
                    }}
                    placeholder={'Catatan'}
                    //secureTextEntry={true}
                    style={styles.input}
                />

                <Button
                    title={'Lanjut'}
                    style={styles.input}
                    onPress={this.loadData}
                />
                <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}

            </View>
        )

    }


    componentDidMount() {

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

AppRegistry.registerComponent('ScreenTagihanDetailAdd', () => ScreenTagihanDetailAdd);
export default ScreenTagihanDetailAdd;