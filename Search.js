import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, Text, Alert, View, SegmentedControlIOS } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Expo, { SQLite, Font, AppLoading, Location, Permissions } from 'expo';
import { Screen, ListView, Button, Icon, TextInput, Title, Subtitle, Divider } from '@shoutem/ui';

const db = SQLite.openDatabase('eventdb.db');

export default class Search extends React.Component {
  static navigationOptions = {title: 'Search Events'};

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

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.state = { 
      location: { coords: { latitude: 0, longitude: 0 }},
      events: [], city: '', keywords: '', date: 'Today' }
  }

  componentDidMount() {
    this.getLocation();
    db.transaction(tx => {
      tx.executeSql('create table if not exists events (id integer primary key not null, title text, venue text, date text);');
    });
  }

  saveItem = (title, venue, date) => {
    db.transaction(tx => {
      tx.executeSql('insert into events (title, venue, date) values (?, ?, ?)', [title, venue, date]);
    }, null);
    Alert.alert("Event saved!");
  }

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert('No permission to access location');
    }
    else {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({location});
    }
  };

  searchNearByEvents = () => {
    fetch('http://api.eventful.com/json/events/search?app_key=qGMbDxBPqCq2kcRf&keywords=' + this.state.keywords + '&where=' + this.state.location.coords.latitude + ',' + this.state.location.coords.longitude + '&within=10&date=' + this.state.date + '&page_size=20&sort_order=popularity&change_multi_day_start=true')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({events: responseJson.events.event});
    })
    .catch((error) => {
      Alert.alert(error);
    });
  }

  searchEvents = () => {
    fetch('http://api.eventful.com/json/events/search?app_key=qGMbDxBPqCq2kcRf&keywords=' + this.state.keywords + '&location=' + this.state.city + '&date=' + this.state.date + '&page_size=20&sort_order=popularity&change_multi_day_start=true')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({events: responseJson.events.event});
    })
    .catch((error) => {
      Alert.alert(error);
    });
  }


  renderRow(item) {
    return(
      <View style={styles.listRow}>
        <Title styleName="md-gutter-bottom">{"\n"}{item.title}</Title>
          <View style={{flex:1, width: "100%", flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
            <Subtitle styleName="sm-gutter-horizontal">Venue: {item.venue_name}{"\n"}Address: {item.venue_address}{"\n"}Date: {item.start_time}{"\n"}</Subtitle>
          </View>
          <Button styleName="stacked clear" onPress={() => this.saveItem(item.title, item.venue_name, item.start_time)}>
            <Text>Save Event</Text>
            <Icon name="add-event" />
          </Button>
        <Divider styleName="line" />
        <Divider styleName="line" />
      </View>
    )
  }
  render () {

    if (!this.state.fontsAreLoaded) {
      return <AppLoading />;
    }

    const events = this.state.events;

    let list;
    if (!events.length) {
      list = <View style={styles.results}>
              <Icon name="up-arrow" />
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Perform a search</Text>
              <Icon name="search" />
            </View>
    } else {
      list = <View style={styles.results}>
      <Screen>
      <ListView
        data={events}
        renderRow={this.renderRow}
      />
      </Screen>
    </View>
    }

    return(
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.search}>
              <View style={styles.datePicker}>
              <SegmentedControlIOS
                values={['Today', 'This week', 'Next week']}
                selectedIndex={0}
                onValueChange={(value) => {
                  this.setState({date: value});
                }}
              />
            </View>
              <Button styleName="confirmation clear" style={{borderColor: 'black', borderWidth: 0.5, borderRadius: 10}} onPress={this.searchNearByEvents}>
                <Text style={{fontWeight: 'bold'}}>Search all nearby events</Text>
                <Icon name="address" />
              </Button>
              <Text>{"\n"}Search by city or keyword (i.e. theatre)</Text>
              <TextInput style={{backgroundColor: 'transparent'}} placeholder={'Location'}
                onChangeText={(city) => this.setState({city})}
                value={this.state.city} />
              <TextInput style={{backgroundColor: 'transparent'}} placeholder={'Keywords (i.e. music)'}
                onChangeText={(keywords) => this.setState({keywords})}
                value={this.state.keywords} />
              <Button styleName="clear" style={{borderColor: 'black', borderWidth: 0.5, borderRadius: 10}} onPress={this.searchEvents}>
                <Text>Search</Text>
                <Icon name="search" />
              </Button>
            </View>
          </TouchableWithoutFeedback>
          {list}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7ff',
  },
  search: {
    flex: 2.5,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10
  },
  results: {
    flex:3,
    backgroundColor: '#ccefff',
    alignItems: 'center',
  },
  listRow: {
    alignItems: 'center',
    paddingTop: 5,
    backgroundColor: '#ccefff',
  },
  datePicker: {
    width: '80%',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
