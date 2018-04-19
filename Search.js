import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class Search extends React.Component {
  static navigationOptions = {title: 'Search'};

  render () {
    const { params } = this.props.navigation.state;

    return(
      <View style={styles.container}>
        <Text>This is the search screen</Text>
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
