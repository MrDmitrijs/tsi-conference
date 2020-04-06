import React, { Component } from 'react';
import {
  ScrollView, View, Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './style.js';
import config from '../../../config';

class AboutView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      conference: {},
    };
  }

  componentDidMount() {
    const { getInfo } = this.props;
    getInfo();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.completed) {
      this.setState({
        conference: nextProps.conference,
        error: nextProps.error,
        completed: nextProps.completed
      });
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.conference.name}</Text>
          <View style={styles.info}>
            <Icon.Button name="calendar" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
              <Text>{new Date(this.props.conference.start).toLocaleDateString() + '-' + new Date(this.props.conference.end).toLocaleDateString()}</Text>
            </Icon.Button>
          </View>
          <View style={styles.info}>
            <Icon.Button name="map-pin" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
              <Text>{this.props.conference.country + ', ' + this.props.conference.address}</Text>
            </Icon.Button>
          </View>
          <View style={styles.info}>
            <Icon.Button name="inbox" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
              <Text>{this.props.conference.email}</Text>
            </Icon.Button>
          </View>
          <View style={styles.info}>
            <Icon.Button name="link" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
              <Text>{this.props.conference.link}</Text>
            </Icon.Button>
          </View>
          <Text style={styles.description}>{this.props.conference.description}</Text>
        </View>
      </ScrollView>
    );
  }
}

export default AboutView;