import React, { Component } from 'react';
import { ActivityIndicator, AppRegistry, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CurrentDisposisi from '../functions/CurrentDisposisi';
import Global from '../functions/Global';
import MyServerSettings from '../functions/MyServerSettings';
import MyFunctions from '../functions/MyFunctions';






class ScreenProgress extends Component {
    person = new CurrentDisposisi();
    constructor(props) {

        super(props);

        this.state = {
            loading: false,
            myData: props.route.params.myData,
            myFungsi: [],
            catatan: "",
            renderCat: false,
            catX: 0,
            catY: 0
        }
    }



    render() {
        this.person = new CurrentDisposisi();
        this.person.fillData(this.state.myData);
        return (

            <ImageBackground style={Global.customStyles.BGImage} source={require('../assets/wp_default.jpg')}>
                <View style={styles.MainContainer}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 5 }}>

                        </View>
                        <View style={{ margin: 5, flexGrow: 1, flexShrink: 1, justifyContent: 'center' }}>
                            <View style={[styles.ContentContainer, { height: 'auto', padding: 10 }]}>
                                <ScrollView style={{ width: '100%', paddingHorizontal: 10, minHeight: 200 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        <View style={{ width: '40%' }}>
                                            {
                                                this.state.myFungsi.map((item) => {
                                                    return this.renderState(item)
                                                })
                                            }
                                        </View>
                                        {
                                            this.person.hadReverse() ? (
                                                <View style={{ width: '40%', justifyContent: 'flex-end' }}>
                                                    {
                                                        this.state.myFungsi.map((item) => {
                                                            return this.renderState(item, true)
                                                        })
                                                    }
                                                </View>
                                            ) : (null)
                                        }
                                    </View>
                                </ScrollView>
                            </View>

                        </View>
                        <View style={{ width: '50%', alignSelf: 'center' }}>

                        </View>





                    </View>
                    <View style={styles.LoadingContainer}>
                        <ActivityIndicator style={styles.ActivityIndicator} size='large' color="red" animating={this.state.loading} />
                        {this.state.loading ? <Text style={styles.ActivityIndicatorText}>Loading... Mohon Tunggu</Text> : null}
                    </View>
                    {this.renderAction()}

                </View>
            </ImageBackground>




        )

    }

    renderAction = () => {
        if (!this.state.renderCat) return null;
        return (
            <View style={[styles.LoadingContainer, { padding: 20, borderRadius: 10, backgroundColor: '#EEEEEE', borderWidth: 1, height: 'auto', elevation: 3, width: 150, top: this.state.catY - 100, left: this.state.catX > 200 ? this.state.catX - 170 : this.state.catX }]}>
                <Text>{this.state.catatan}</Text>
            </View>
        );
    }

    getArrowType = (cur, reverse = false) => {
        var arrowType = "NORMAL";
        if (cur.getRow()["status"] == 0) {
            arrowType = "DOT";
        } else if (cur.getRow()["status"] == 1) {
            if (cur.getNext() == null) {
                arrowType = "SUCCESS";
            } else {
                arrowType = "NORMAL";
            }
        } else if (cur.getRow()["status"] == 2) {
            arrowType = "NO";
        } else if (cur.getRow()["status"] == 3) {
            if (!reverse) {
                arrowType = "NORMAL";
            } else {
                arrowType = "DOT";
            }
        } else if (cur.getRow()["status"] == 4) {
            if (!reverse) {
                if (cur.getNext() != null) {
                    if (cur.getNext().getRow()["status"] == 0) {
                        arrowType = "RIGHT";
                    } else {
                        arrowType = "NORMAL";
                    }
                } else {
                    arrowType = "RIGHT";
                }
            } else {
                arrowType = "NORMAL";
            }
        } else if (cur.getRow()["status"] == 5) {
            if (!reverse) {
                if (cur.getNext() != null) {
                    if (cur.getNext().getRow()["status"] == 0) {
                        arrowType = "RIGHT";
                    } else {
                        arrowType = "NORMAL";
                    }
                } else {
                    arrowType = "RIGHT";
                }
            } else {
                arrowType = "NO";
            }
        }

        if (reverse) {
            if (cur == cur.getFirst()) {
                if (arrowType != "NO") arrowType = "NULL";
            }
        } else {
            if (cur == cur.getLast()) {
                if (arrowType != "RIGHT" && arrowType != "NO" && arrowType != "SUCCESS") arrowType = "NULL";
            }
        }
        return arrowType;
    }

    getCatByFungsi = (fungsi, arr) => {
        if (fungsi == "FUNGSI_001") {
            return arr["cat_pembuat"];
        }
        if (fungsi == "FUNGSI_002") {
            return arr["cat_pengaju"];
        }
        if (fungsi == "FUNGSI_003") {
            return arr["cat_kakanwil"];
        }
        if (fungsi == "FUNGSI_004") {
            return arr["cat_minkeu"];
        }
        if (fungsi == "FUNGSI_005") {
            return arr["cat_verifikator"];
        }
        return arr["cat_bag_keu"];
    }
    showCat = (person, reverse = false, evt) => {
        var cat = "";
        if (reverse) {
            if (person.getRow()["status"] == "4" || person.getRow()["status"] == "5") {
                cat = this.getCatByFungsi(person.getFungsi(), this.state.myData);
            } else {
                cat = "";
            }
        } else {
            if (person.getRow()["status"] == "1" || person.getRow()["status"] == "2" || person.getRow()["status"] == "3") {
                cat = this.getCatByFungsi(person.getFungsi(), this.state.myData);
            } else {
                if (person.getRow()["status"] == "4") {
                    var nxt = person.getNext();
                    if (nxt != null) {
                        if (nxt.getRow()["status"] == "0") {
                            cat = this.getCatByFungsi(person.getFungsi(), this.state.myData);
                        } else {
                            MyFunctions.msgBox("Maaf, catatan ini tidak lagi tersedia, karena " + person.getNmFungsi() + " telah menyetujui revisi.");
                            cat = "";
                        }
                    } else {
                        MyFunctions.msgBox("Maaf, catatan ini tidak lagi tersedia, karena " + person.getNmFungsi() + " telah menyetujui revisi.");
                        cat = "";
                    }
                } else {
                    cat = "";
                }
            }
        }
        if (cat != "") {
            this.setState({
                catatan: cat,
                renderCat: true,
                catX: evt.nativeEvent.pageX,
                catY: evt.nativeEvent.pageY
            });
        } else {
            this.setState({
                renderCat: false
            });
        }
    }

    renderState = (item, reverse = false) => {
        let cur = this.person.findMe(item.id_fungsi);
        var row = cur.getRow();
        var arrowType = this.getArrowType(cur, reverse);
        if (!reverse) {
            return (
                <View style={{ height: 100 }} key={cur.getFungsi()}>
                    <View style={{ borderRadius: 5, elevation: 3, height: 44, margin: 3, justifyContent: 'center', backgroundColor: row["status"] != 0 ? Global.getFungsiColor(cur.getFungsi()) : "#aaaaaa" }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: "#FFFFFF" }}>{item.fungsi_disposisi}</Text>
                        {
                            row["id"] != null ?
                                <Text style={{ fontSize: 10, textAlign: 'center', color: "#FFFFFF" }}>{row["nm"]}</Text>
                                : null
                        }
                    </View>
                    <View style={{ height: 50, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={(evt) => this.showCat(cur, reverse, evt)}>
                            <MaterialCommunityIcons
                                name={
                                    arrowType == "NORMAL" ? (
                                        "arrow-down-bold"
                                    ) : (
                                        arrowType == "DOT" ? (
                                            "dots-vertical"
                                        ) : (
                                            arrowType == "NO" ? (
                                                "close-circle"
                                            ) : (
                                                arrowType == "RIGHT" ? (
                                                    "arrow-right-bold"
                                                ) : (
                                                    arrowType == "SUCCESS" ? (
                                                        "check-circle"
                                                    ) : (
                                                        ""
                                                    )
                                                )
                                            )
                                        )
                                    )
                                }
                                size={50}
                                color={row["status"] != 0 ? row["status"] == 2 ? "#FF0000" : Global.getFungsiColor(cur.getFungsi()) : "#aaaaaa"}
                                style={{ alignSelf: 'center', height: '100%' }}
                            />
                        </TouchableOpacity>


                    </View>
                </View>
            );
        } else {
            if (cur.getNext() == null) {
                return null;
            } else {
                if (cur.getNext().getRow()["status"] == 0) return (<View style={{ height: 100 }} key={cur.getFungsi()} />);
            }
            if (row["status"] == 0) return (<View style={{ height: 100 }} key={cur.getFungsi()} />);
            return (
                <View style={{ height: 100 }} key={cur.getFungsi()}>
                    <View style={{ height: 50, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={(evt) => this.showCat(cur, reverse, evt)}>
                            <MaterialCommunityIcons
                                name={
                                    arrowType == "NORMAL" ? (
                                        "arrow-up-bold"
                                    ) : (
                                        arrowType == "DOT" ? (
                                            "dots-vertical"
                                        ) : (
                                            arrowType == "NO" ? (
                                                "close-circle"
                                            ) : (
                                                ""
                                            )
                                        )
                                    )
                                }
                                size={50}
                                color={row["status"] != 3 ? row["status"] == 5 ? "#FF0000" : Global.getFungsiColor(cur.getFungsi()) : "#aaaaaa"}
                                style={{ alignSelf: 'center', height: '100%' }}
                            />
                        </TouchableOpacity>

                    </View>
                    <View style={{ borderRadius: 5, elevation: 3, height: 44, margin: 3, justifyContent: 'center', backgroundColor: row["status"] != 3 ? Global.getFungsiColor(cur.getFungsi()) : "#aaaaaa" }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: "#FFFFFF" }}>{item.fungsi_disposisi}</Text>
                        {
                            row["id"] != null ?
                                <Text style={{ fontSize: 10, textAlign: 'center', color: "#FFFFFF" }}>{row["nm"]}</Text>
                                : null
                        }
                    </View>
                </View>
            );
        }






    }

    componentDidMount() {
        this.loadDataFungsi();
    }

    loadDataFungsi = () => {
        this.setState({ loading: true })
        let url = MyServerSettings.getPhp("get_list_fungsi.php");
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    myFungsi: responseJson
                })
            })
            .catch((error) => {
                console.log('Error selecting random data: ' + error)
                this.setState({ loading: false })
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

AppRegistry.registerComponent('ScreenProgress', () => ScreenProgress);
export default ScreenProgress;