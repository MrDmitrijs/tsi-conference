import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { ListItem, Card } from 'react-native-elements';
import Modal from 'react-native-modal';
import config from '../../../config';
import { Button } from 'react-native-elements';

class SpeakersView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      conference: {speakers:[]},
      speaker: {},
      modal: false
    };
  }

  componentDidMount() {
    const { getInfo } = this.props;
    getInfo();
    this.setState({speaker: {},modal: false})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.completed) {
      this.setState({
        conference: nextProps.conference,
        error: nextProps.error,
        completed: nextProps.completed,
        modal: false
      });
    }
  }

  render() {
    return (
      <View>
        {
          this.state.conference.speakers.map((speaker, i) => (
            <ListItem
              key={i}
              title={speaker.name + ' ' + speaker.surname}
              subtitle={speaker.degree}
              onPress={()=>this.setState({speaker: speaker, modal: true})}
            />
          ))
        }
        {
            <Modal isVisible={this.state.modal}
                   onSwipe={() => this.setState({ modal: false })}
                   onBackdropPress={() => this.setState({ modal: false })}>
              <Card title={(this.state.speaker.name + ' ' + this.state.speaker.surname ||'').toUpperCase()} >
                <View>
                  <Text style={{fontWeight:'700'}}>{this.state.speaker.degree}</Text>
                  <Text style={{textAlign: 'justify', marginTop: 10}}>{this.state.speaker.about}</Text>
                  <Text style={{textAlign: 'justify', marginTop: 10}}>Organization : {this.state.speaker.organization}</Text>

                  <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                    <Icon.Button name="mail" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
                      <Text>{this.state.speaker.email}</Text>
                    </Icon.Button>
                    <Icon.Button name="location" backgroundColor="transparent" color={config.PRIMARY_BG_COLOR}>
                      <Text>{this.state.speaker.country}</Text>
                    </Icon.Button>
                  </View>
                  <Button
                    title='CLOSE'
                    buttonStyle={{
                      backgroundColor: config.PRIMARY_BG_COLOR,
                      marginTop: 10
                    }}
                    onPress={()=>this.setState({modal: false})}
                  />
                </View>
              </Card>
            </Modal>
        }
      </View>
    );
  }

}

SpeakersView.propTypes = {
  getInfo: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  conference: PropTypes.object.isRequired
};

export default SpeakersView;