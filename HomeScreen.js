import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Expo, { Font, AppLoading } from 'expo';
import { Button, Icon } from '@shoutem/ui';

export default class HomeScreen extends React.Component {
  static navigationOptions = {title: 'Home'};

  state = {
    fontsAreLoaded: false,
  };

  async componentWillMount() {
    await Font.loadAsync({
      'Rubik-Black': require('./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf'),
      'Rubik-BlackItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
      'Rubik-Bold': require('./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf'),
      'Rubik-BoldItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
      'Rubik-Italic': require('./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf'),
      'Rubik-Light': require('./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf'),
      'Rubik-LightItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
      'Rubik-Medium': require('./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf'),
      'Rubik-MediumItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
      'Rubik-Regular': require('./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf'),
      'rubicon-icon-font': require('./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf'),
    });

    this.setState({ fontsAreLoaded: true });
  }

  render () {

    if (!this.state.fontsAreLoaded) {
      return <AppLoading />;
    }

    const { navigate } = this.props.navigation;

    return(
      <View style={styles.container}>
        <View style={styles.text}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Welcome to Event Finder.</Text>
          <Text style={{fontSize: 20}}>Find events nearby and save them.</Text>
        </View>
          <View style={styles.images}>
            <Image source={require('./images/calendar_icon.png')} style={{width: 120, height: 130}} />
            <Image source={require('./images/turntable.png')} style={{width: 160, height: 130}} />
          </View>
          <View style={styles.links}>
            <View style={{flexDirection: 'row'}}>
                <Button styleName="stacked clear confirmation" onPress={() => navigate('Search')}>
                  <Text>Search Events</Text>
                  <Icon name="search" />
                </Button>
                <Button styleName="stacked clear confirmation" onPress={() => navigate('Saved')}>
                  <Text>Saved Events</Text>
                  <Icon name="events" />
                </Button>
          </View>
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    flex: 2,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  images: {
    flex: 2.5,
    backgroundColor: '#ccefff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  links: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#b3e7ff'
  }
});
