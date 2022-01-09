import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restart } from 'fiction-expo-restart';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, AppRegistry, Button, ImageBackground, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import MyFunctions from '../functions/MyFunctions';





class ScreenChangePass extends Component {

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            myData: [],
            txtPassCur: "",
            txtPassNew: "",
            txtPassConfirm: ""
        }


    }



    render() {
        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default.jpg')}>
                <View style={styles.MainContainer}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5, padding: 10 }}>
                            <MaterialCommunityIcons
                                name="key-variant"
                                size={50}
                                color={'#101417'}
                                style={{ alignSelf: 'center' }}
                            />
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'flex-start' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10, backgroundColor: '#FFFFFF' }]}>
                                <ScrollView style={{ width: '100%', paddingHorizontal: 10 }}>
                                    <Text style={Global.customStyles.Label}>Kata Sandi saat ini</Text>
                                    <TextInput
                                        value={this.state.txtPassCur}
                                        onChangeText={(passCur) => {
                                            this.setState({ txtPassCur: passCur });
                                        }}
                                        placeholder={'Kata Sandi saat ini'}
                                        secureTextEntry={true}
                                        style={Global.customStyles.Input}
                                    />
                                    <Text style={Global.customStyles.Label}>Kata Sandi baru</Text>
                                    <TextInput
                                        value={this.state.txtPassNew}
                                        onChangeText={(passNew) => {
                                            this.setState({ txtPassNew: passNew });
                                        }}
                                        placeholder={'Kata Sandi baru'}
                                        secureTextEntry={true}
                                        style={Global.customStyles.Input}
                                    />
                                    <Text style={Global.customStyles.Label}>Konfirmasi Kata Sandi baru</Text>
                                    <TextInput
                                        value={this.state.txtPassConfirm}
                                        onChangeText={(passConfirm) => {
                                            this.setState({ txtPassConfirm: passConfirm });
                                        }}
                                        placeholder={'Konfirmasi Kata Sandi baru'}
                                        secureTextEntry={true}
                                        style={Global.customStyles.Input}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>
                            <Button
                                title={'Ganti Kata Sandi'}
                                color='#101417'
                                style={styles.input}
                                onPress={this.changePass}
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

    validData = () => {
        if (this.state.txtPassCur === "") {
            MyFunctions.msgBox("Silahkan masukkan Kata Sandi saat ini");
            return false;
        }
        if (this.state.txtPassNew === "") {
            MyFunctions.msgBox("Silahkan masukkan Kata Sandi baru");
            return false;
        }
        if (this.state.txtPassConfirm === "") {
            MyFunctions.msgBox("Silahkan masukkan konfirmasi Kata Sandi baru");
            return false;
        }
        if (this.state.txtPassNew !== this.state.txtPassConfirm) {
            MyFunctions.msgBox("Konfirmasi Kata Sandi tidak sama");
            return false;
        }
        return true;

    }

    changePass = () => {
        if (!this.validData()) return;
        Alert.alert("Konfirmasi?", "Aplikasi akan diulang kembali setelah mengubah kata sandi. Lanjutkan?", [
            {
                text: "Batal",
                onPress: null,
                style: "cancel"
            },
            {
                text: "Ya", onPress: () => {
                    this.uploadData();
                }
            }
        ]);
    }
    uploadData = () => {
        this.setState({ loading: true })
        fetch(
            MyServerSettings.getPhp("post_change_pass.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user": Global.getCurUserId(),
                    "pass": this.state.txtPassCur,
                    "pass_new": this.state.txtPassNew
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
            .then(this.onSuccess)
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
            });
    }
    onSuccess = () => {
        if (this.state.myData[0]["succeed"] == 1) {
            MyFunctions.msgBox("Kata Sandi telah diubah. Silahkan masuk kembali.")
            this.storePass("").then(this.reLogin);
        } else {
            MyFunctions.msgBox(this.state.myData[0]["error"]);
        }
    }
    reLogin = () => {
        if (this.state.myData[0]["succeed"] == 1) {
            Restart();
        }
    }
    storePass = async (value) => {
        try {
            await AsyncStorage.setItem(Global.getPassKey(), value)
        } catch (e) {
            console.log("write error");
        }
    }
    componentDidMount() {

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
        justifyContent: 'center',
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

AppRegistry.registerComponent('ScreenChangePass', () => ScreenChangePass);
export default ScreenChangePass;