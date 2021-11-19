
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';



function MainScreen({ navigation, route }) {
    return (
        <View style={styles.container}>
            <Text onPress={() => navigation.navigate('Test List')}>
                Test List
            </Text>
            <Text onPress={() => navigation.navigate('Test PDF')}>
                Test PDF
            </Text>
            <Text onPress={() => navigation.navigate('Test Notif')}>
                Test Notif
            </Text>
            <Text onPress={() => navigation.navigate('Test Service')}>
                Test Service
            </Text>
        </View>
        
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'dodgerblue',
        
    },
});

export default MainScreen;