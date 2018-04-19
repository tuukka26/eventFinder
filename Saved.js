import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class Saved extends React.Component {
  static navigationOptions = {title: 'Saved'};

  render () {
    const { params } = this.props.navigation.state;

    return(
      <View style={styles.container}>
        <Text>This is the saved screen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
