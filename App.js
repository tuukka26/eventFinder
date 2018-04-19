import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import Search from './Search';
import Saved from './Saved';

export default class App extends React.Component {
  render() {

    const EventFinder = StackNavigator({
      Home: {screen: HomeScreen},
      Search: {screen: Search},
      Saved: {screen: Saved}
    });

    return <EventFinder/>;
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
