import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, Button, FlatList, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Global from '../functions/Global';
import MyFunctions from '../functions/MyFunctions';
import MyServerSettings from '../functions/MyServerSettings';






class ScreenItemAdd extends Component {

    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            myParentData: props.route.params.myParentData,
            myData: [{
                'id_item': '',
                'nm_item': '',
                'satuan': '',
                'harga_patokan': '0',
                'ket_item': ''
            }],
            myResult: [],
            myItemSug: [],
            showItemSug:false,
            menuItemVisible:false
        }
        


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
                                <ScrollView style={{ width: '100%', paddingHorizontal: 10 }} keyboardShouldPersistTaps={'handled'}>
                                    <Text style={Global.customStyles.Label}>Item</Text>
                                    <TextInput
                                        value={this.state.myData[0]['nm_item']}
                                        onChangeText={(nm_item) => {
                                            nm_item = MyFunctions.validateString(nm_item);
                                            let arr = this.state.myData;
                                            arr[0]['nm_item'] = nm_item;
                                            this.setState({ myData: arr });
                                            if(this.state.showItemSug)this.loadSug(nm_item);
                                        }}
                                        onFocus={()=>{if(this.state.myData[0]['nm_item']!="")this.setState({showItemSug:true})}}
                                        onPressOut={()=>{if(this.state.myData[0]['nm_item']!="")this.setState({showItemSug:true})}}
                                        onKeyPress={()=>{if(this.state.myData[0]['nm_item']!="")this.setState({showItemSug:true})}}
                                        onEndEditing={()=>{this.setState({showItemSug:false})}}
                                        placeholder={'Item'}
                                        style={Global.customStyles.Input}
                                        autoCapitalize='words'
                                        autoCorrect={true}
                                    />
                                    {this.state.myItemSug!=undefined && this.state.myItemSug.length>0 && this.state.showItemSug?
                                    <View style={{borderWidth:1,padding:10}}>
                                        {this.state.myItemSug.map(this.renderSug)}
                                    </View>
                                    :null}
                                    
                                    <Text style={Global.customStyles.Label}>Satuan</Text>
                                    <TextInput
                                        value={this.state.myData[0]['satuan']}
                                        onChangeText={(satuan) => {
                                            satuan = MyFunctions.validateString(satuan);
                                            let arr = this.state.myData;
                                            arr[0]['satuan'] = satuan;
                                            this.setState({ myData: arr });
                                        }}
                                        //onFocus={()=>{this.setState({showItemSug:false})}}
                                        placeholder={'Satuan'}
                                        style={Global.customStyles.Input}
                                        autoCapitalize='words'
                                        autoCorrect={true}
                                    />
                                    <Text style={Global.customStyles.Label}>Standar Harga</Text>
                                    <TextInput
                                        value={this.state.myData[0]['harga_patokan']}
                                        onChangeText={(harga_patokan) => {
                                            harga_patokan = MyFunctions.validateInputDouble(harga_patokan);
                                            let arr = this.state.myData;
                                            arr[0]['harga_patokan'] = harga_patokan;
                                            this.setState({ myData: arr });
                                        }}
                                        //onFocus={()=>{this.setState({showItemSug:false})}}
                                        placeholder={'Standar Harga'}
                                        style={Global.customStyles.Input}
                                        keyboardType="numeric"
                                        numeric
                                    />
                                    <Text style={Global.customStyles.Label}>Keterangan</Text>
                                    <TextInput
                                        value={this.state.myData[0]['ket_item']}
                                        onChangeText={(ket_item) => {
                                            ket_item = MyFunctions.validateString(ket_item);
                                            let arr = this.state.myData;
                                            arr[0]['ket_item'] = ket_item;
                                            this.setState({ myData: arr });
                                        }}
                                        //onFocus={()=>{this.setState({showItemSug:false})}}
                                        placeholder={'Keterangan'}
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
                                onPress={this.saveItem}
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
        if (this.state.myData.length == 0) return false;
        if (this.state.myData[0]['nm_item'] == "") {
            MyFunctions.msgBox("Nama item tidak valid");
            return false;
        }
        if (this.state.myData[0]['satuan'] == "") {
            MyFunctions.msgBox("Satuan tidak valid");
            return false;
        }
        let hrg = Number.parseFloat(this.state.myData[0]['harga_patokan']);
        if (isNaN(hrg) || hrg <= 0) {
            MyFunctions.msgBox("Standar harga tidak valid");
            return false;
        }
        return true;
    }

    saveItem = () => {
        if (!this.validData()) return;
        console.log(JSON.stringify(this.state.myData[0]));
        this.setState({ loading: true })
        fetch(
            MyServerSettings.getPhp("add_item.php"),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.myData[0]),
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
        console.log(this.state.myResult);
        if (this.state.myResult[0]['succeed']) {
            MyFunctions.msgBox("Data tersimpan");
            this.props.navigation.goBack();
        } else {
            MyFunctions.msgBox("Gagal menyimpan\n" + this.state.myResult[0]['error']);
        }
    }
    componentDidMount() {

    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    renderSug=(item,index)=>{
        return(
            <TouchableOpacity onPress={()=>{
                var nm_item = MyFunctions.validateStringFirstCap(item.value);
                let arr = this.state.myData;
                arr[0]['nm_item'] = nm_item;
                this.setState({ myData: arr, showItemSug:false });
            }} key={index} >
                <Text style={{padding:2}}>{MyFunctions.validateStringFirstCap(item.value)}</Text>
            </TouchableOpacity>
        );
    }

    loadSug = (txt) => {
        this.setState({ loading: true })
        let url = "https://serpapi.com/search.json?engine=google_autocomplete&q="+txt+"&hl=id&gl=id&api_key=e30886bb7a1588e78063eca03072f02fd155c10efff53c2322a224af68056064";
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myItemSug: responseJson["suggestions"]
                })
            })
            .catch((error) => {
                this.setState({ loading: false, myItemSug: [] })
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

AppRegistry.registerComponent('ScreenItemAdd', () => ScreenItemAdd);
export default ScreenItemAdd;