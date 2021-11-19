import React, { Component } from 'react';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { AppRegistry, StyleSheet, Button, Text, View, Platform, Alert} from 'react-native';



class TestPDF extends Component {
  

  constructor(props){

    super(props);

    this.state = { 
      loading: true,
      myHTML:'kosong',
      selectedPrinter: null
    }
  }

  print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: this.state.myHTML,
      printerUrl: this.state.selectedPrinter?.url, // iOS only
    });
  }

  printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html: this.state.myHTML
    });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }

  selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    this.setState({selectedPrinter:printer});
  }

  render(){
    return(
      <View style={styles.container}>
        <Button title='Print' onPress={this.print}  />
        <View style={styles.spacer} />
        <Button title='Print to PDF file' onPress={this.printToFile}/>
        {Platform.OS === 'ios' &&
          <>
            <View style={styles.spacer} />
            <Button title='Select printer' onPress={this.selectPrinter}/>
            <View style={styles.spacer} />
            {this.state.selectedPrinter ? <Text style={styles.printer}>{`Selected printer: ${this.state.selectedPrinter.name}`}</Text> : undefined}
          </>
        }
      </View>
    )
  }

  loadData=()=>{
    
    this.setState({loading: true})
    fetch('http://34.101.240.1/bulog/mobile/php_json/test.php?res=10&pg=2')
      .then((response) => response.text())
      .then((responseText) => {
        this.setState({
          loading: false,
          myHTML: responseText
        })
      })
      .catch((error) => {
        console.log('Error selecting random data: '+ error)
        this.setState({loading:false})
      });
      
  }

  componentDidMount() {
    this.loadData()
  }

  
}

  

const styles = StyleSheet.create({
  ActivityIndicator:{
    position:'absolute',
    width:'100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    flexDirection: 'column',
    padding: 8,
  },
  spacer: {
    height: 8
  },
  printer: {
    textAlign: 'center',
  }
});

AppRegistry.registerComponent('TestPDF', () => TestPDF);
export default TestPDF;