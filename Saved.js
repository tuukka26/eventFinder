import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Expo, { SQLite, Font, AppLoading } from 'expo';
import { TextInput, Icon, ListView, Screen, Tile, Title, Subtitle, Divider, Button } from '@shoutem/ui';

const db = SQLite.openDatabase('eventdb.db');

export default class Saved extends React.Component {
  static navigationOptions = { title: 'Saved Events' };

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
    this.state = {events: []};
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('create table if not exists events (id integer primary key not null, title text, venue text, date text);');
    });
    this.updateList();
  }

  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from events', [], (_, { rows }) =>
        this.setState({events: rows._array})
      );
    });
  }

  deleteItem = (id) => {
    Alert.alert(
      'Remove Event',
      'Are you sure you want to remove this event?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => db.transaction(
          tx => {
            tx.executeSql('delete from events where id = ?;', [id]);
          }, null, this.updateList
        )},
      ],
      { cancelable: false }
    );
  }

  renderRow(item) {
    return (
      <View style={styles.listRow}>
          <Title styleName="md-gutter-bottom">{"\n"}{item.title}</Title>
          <View style={{flex:1, width: "100%", flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
            <Subtitle styleName="sm-gutter-horizontal">Venue: {item.venue}{"\n"}Date: {item.date}{"\n"}</Subtitle>
          </View>
          <Button styleName="stacked clear" onPress={() => this.deleteItem(item.id)}>
            <Text>Remove Event</Text>
            <Icon name="close" />
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
      list = <View style={styles.emptyList}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>You have no saved events.</Text>
              <Icon name="error" />
            </View>
    } else {
      list = <View style={styles.list}>
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
        <View style={styles.title}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Your saved events</Text>
        </View>
        {list}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    flex: 0.2,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyList: {
    flex: 1,
    backgroundColor: '#ccefff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRow: {
    alignItems: 'center',
    paddingTop: 5,
    backgroundColor: '#ccefff',
  },
});
