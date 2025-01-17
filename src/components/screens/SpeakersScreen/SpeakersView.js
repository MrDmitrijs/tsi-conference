import React, { Component } from 'react';
import {View, Text, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { ListItem, Card, Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import config from '../../../config';

class SpeakersView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      speakers: [],
      speaker: {},
      modal: false
    };
  }

  componentDidMount() {
    const { getInfo } = this.props;
    getInfo();
    this.setState({
      speaker: {},
      modal: false
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.completed) {
      this.setState({
        speakers: nextProps.conferenceInfo.speakers,
        error: nextProps.error,
        completed: nextProps.completed,
        modal: false
      });
    }
  }

  render() {
    return (
      <View>
        <ScrollView>
        {
          this.state.speakers.map((speaker, i) => (
            <ListItem
              key={i}
              title={speaker.name + ' ' + speaker.surname}
              subtitle={speaker.degree}
              onPress={()=>this.setState({speaker: speaker, modal: true})}
            />
          ))
        }
        </ScrollView>
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

export default SpeakersView;