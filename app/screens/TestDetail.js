
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';



function TestDetailScreen({ navigation, route }) {
    const {id}=route.params;
    return (
        <View style={styles.container}>
            <Text>
                {id}
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

export default TestDetailScreen;