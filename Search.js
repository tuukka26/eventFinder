import React from 'react';
import { StyleSheet, Button, Text, Alert, View, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions } from 'expo';

export default class Search extends React.Component {
  static navigationOptions = {title: 'Search Events'};

  constructor(props) {
    super(props);
    this.state = { 
      location: { coords: { latitude: 0, longitude: 0 }},
      events: [], city: '', keywords: '', date: 'Future'}
  }

  componentDidMount() {
    this.getLocation();
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
    fetch('http://api.eventful.com/json/events/search?app_key=qGMbDxBPqCq2kcRf&keywords=' + this.state.keywords + '&where=' + this.state.location.coords.latitude + ',' + this.state.location.coords.longitude + '&within=10&date=' + this.state.date)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({events: responseJson.events.event});
    })
    .catch((error) => {
      Alert.alert(error);
    });
  }

  listSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "80%",
          backgroundColor: "#CED0CE",
          marginLeft: "10%"
        }}
      />
    );
  };

  render () {
    const { params } = this.props.navigation.state;

    return(
      <View style={styles.container}>
        <Button title="Find nearby events" onPress={this.searchNearByEvents} />
        <FlatList
          style={{marginLeft : "5%"}}
          keyExtractor={item => item.title}
          renderItem={({item}) => <Text>{item.title} @ {item.venue_name}</Text>}
          data={this.state.events}
          ItemSeparatorComponent={this.listSeparator} />
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
