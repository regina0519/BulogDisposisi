import React, { Component } from 'react';
import { ActivityIndicator, Alert, AppRegistry, BackHandler, Button, ImageBackground, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Global from '../functions/Global';
import MyFunctions from '../functions/MyFunctions';
import MyServerSettings from '../functions/MyServerSettings';






class ScreenAdminBidangEdit extends Component {
    myDataBU = [];
    constructor(props) {

        super(props);
        let data = props.route.params.myData;
        if (data == null) data = this.newRecord();
        this.state = {
            loading: false,
            myData: data,
            myResult: [],
            allowSave: false
        }
        this.backupData();

    }

    newRecord = () => {
        return ({
            'id_bidang': '',
            'nm_bidang': '',
            'kode_bidang': ''
        });
    }

    render() {
        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default.jpg')}>
                <View style={styles.MainContainer}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5 }}>

                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'center' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10 }]}>
                                <ScrollView style={{ width: '100%', paddingHorizontal: 10 }}>
                                    <Text style={Global.customStyles.Label}>Bidang</Text>
                                    <TextInput
                                        value={this.state.myData['nm_bidang']}
                                        onChangeText={(nm_bidang) => {
                                            nm_bidang = MyFunctions.validateString(nm_bidang);
                                            let arr = this.state.myData;
                                            arr['nm_bidang'] = nm_bidang;
                                            this.setState({ myData: arr });
                                            this.setAllowSave();
                                        }}
                                        placeholder={'Bidang'}
                                        style={Global.customStyles.Input}
                                    />
                                    <Text style={Global.customStyles.Label}>Kode</Text>
                                    <TextInput
                                        value={this.state.myData['kode_bidang']}
                                        onChangeText={(kode_bidang) => {
                                            kode_bidang = MyFunctions.validateString(kode_bidang);
                                            let arr = this.state.myData;
                                            arr['kode_bidang'] = kode_bidang;
                                            this.setState({ myData: arr });
                                            this.setAllowSave();
                                        }}
                                        placeholder={'Kode Bidang'}
                                        style={Global.customStyles.Input}
                                    />
                                </ScrollView>
                            </View>

                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>
                            <Button
                                title={'Simpan'}
                                color='#101417'
                                style={styles.input}
                                onPress={this.save}
                                disabled={!this.state.allowSave}
                            />
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


    save = () => {
        console.log(JSON.stringify(this.state.myData));
        this.setState({ loading: true });
        fetch(
            MyServerSettings.getPhp("post_bidang.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: "[" + JSON.stringify(this.state.myData) + "]",
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myResult: responseJson
                })
            })
            .then(this.processResult)
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });

    }
    processResult = () => {
        if (this.state.myResult[0]['succeed']) {
            MyFunctions.msgBox("Data tersimpan");
            this.props.navigation.goBack();
        } else {
            MyFunctions.msgBox("Gagal menyimpan\n" + this.state.myResult[0]['error']);
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    backAction = () => {
        if ((JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU))) {
            Alert.alert("Konfirmasi?", "Anda belum menyimpan data yang telah diubah. Batalkan perubahan?", [
                {
                    text: "Tidak",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "Ya", onPress: () => {
                        this.props.navigation.goBack();
                    }
                }
            ]);
        } else {
            this.props.navigation.goBack();
        }

        return true;
    };
    backupData = () => {
        this.myDataBU = JSON.parse(JSON.stringify(this.state.myData));
    }
    setAllowSave = () => {
        let edited = (JSON.stringify(this.state.myData) !== JSON.stringify(this.myDataBU));
        this.setState({
            allowSave: edited && (this.state.myData["nm_bidang"] !== "")
        });
    }


}




const styles = StyleSheet.create({

    MainContainer: {
        margin: 1,
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
        justifyContent: 'center'
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

AppRegistry.registerComponent('ScreenAdminBidangEdit', () => ScreenAdminBidangEdit);
export default ScreenAdminBidangEdit;