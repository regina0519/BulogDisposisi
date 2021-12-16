import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Global from '../functions/Global';






class ScreenAdmin extends Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: false,
            myData: [],
            user: '',
            password: ''
        }
    }



    render() {
        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default_main.jpg')}>
                <View style={[styles.MainContainer, { paddingTop: '20%' }]}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5, padding: 10 }}>
                            <MaterialCommunityIcons
                                name="tools"
                                size={50}
                                color={'#101417'}
                                style={{ alignSelf: 'center' }}
                            />
                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'flex-start' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10 }]}>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: 5, padding: 5, paddingLeft: 20, alignItems: 'center', borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}
                                    onPress={() => this.props.navigation.navigate('Pegawai')}
                                >
                                    <MaterialCommunityIcons
                                        name="account-details"
                                        size={30}
                                        color={'#101417'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ padding: 3, paddingLeft: 15, fontWeight: 'bold' }}>Pegawai</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: 5, padding: 5, paddingLeft: 20, alignItems: 'center', borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}
                                    onPress={() => this.props.navigation.navigate('Jabatan')}
                                >
                                    <MaterialCommunityIcons
                                        name="account-star"
                                        size={30}
                                        color={'#101417'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ padding: 3, paddingLeft: 15, fontWeight: 'bold' }}>Jabatan</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: 5, padding: 5, paddingLeft: 20, alignItems: 'center', borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}
                                    onPress={() => this.props.navigation.navigate('Fungsi')}
                                >
                                    <MaterialCommunityIcons
                                        name="account-check"
                                        size={30}
                                        color={'#101417'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ padding: 3, paddingLeft: 15, fontWeight: 'bold' }}>Fungsi</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', margin: 5, padding: 5, paddingLeft: 20, alignItems: 'center', borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}
                                    onPress={() => this.props.navigation.navigate('Bidang')}
                                >
                                    <MaterialCommunityIcons
                                        name="account-group"
                                        size={30}
                                        color={'#101417'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ padding: 3, paddingLeft: 15, fontWeight: 'bold' }}>Bidang</Text>
                                </TouchableOpacity>
                            </View>
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

AppRegistry.registerComponent('ScreenAdmin', () => ScreenAdmin);
export default ScreenAdmin;