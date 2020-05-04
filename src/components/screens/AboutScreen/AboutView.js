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
      conferenceInfo: {},
    };
  }

  componentDidMount() {
    const { getInfo } = this.props;
    getInfo();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.completed) {
      this.setState({
        conferenceInfo: nextProps.conferenceInfo,
        error: nextProps.error,
        completed: nextProps.completed
      });
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.conferenceInfo.name}</Text>
          <View style={styles.info}>
            <Icon.Button name="calendar" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
              <Text>{new Date(this.props.conferenceInfo.start).toLocaleDateString() + '-' + new Date(this.props.conferenceInfo.end).toLocaleDateString()}</Text>
            </Icon.Button>
          </View>
          <View style={styles.info}>
            <Icon.Button name="map-pin" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
              <Text>{this.props.conferenceInfo.country + ', ' + this.props.conferenceInfo.address}</Text>
            </Icon.Button>
          </View>
          <View style={styles.info}>
            <Icon.Button name="inbox" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
              <Text>{this.props.conferenceInfo.email}</Text>
            </Icon.Button>
          </View>
          <View style={styles.info}>
            <Icon.Button name="link" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
              <Text>{this.props.conferenceInfo.link}</Text>
            </Icon.Button>
          </View>
          <Text style={styles.description}>{this.props.conferenceInfo.description}</Text>
        </View>
      </ScrollView>
    );
  }
}

export default AboutView;