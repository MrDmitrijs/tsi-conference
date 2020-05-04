import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SectionList, Text, View} from 'react-native';
import SegmentedControlIOS from "@react-native-community/segmented-control";
import {Card, ListItem} from 'react-native-elements';
import Modal from 'react-native-modal';
import config from '../../../config';

class ScheduleView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conference: {sessions: []},
            session: {},
            section: {},
            modal: false,
            sessions: [],
            sessionsAndPlaces: new Map(),
            selectedIndex: 0,
            days: []
        };
    }

    componentDidMount() {
        const {getInfo} = this.props;
        getInfo();
        this.setState({
            session: {},
            modal: false,
            sessions: []
        })
    }

    getDaysOfConference(conference) {
        const startDate = new Date(conference.start),
            endDate = new Date(conference.end),
            result = [];
        for (let i = 0; i <= endDate.getDate() - startDate.getDate();) {
            let numberOfTheDay = i + 1;
            result.push('DAY ' + numberOfTheDay);
            i++;
        }
        return result;
    }

    filterSessions(conference, sessions, selectedIndex) {
        const daysNumber = this.getDaysOfConference(conference).length;
        if (!daysNumber) return sessions;

        const startDate = new Date(conference.start).getDate() + selectedIndex,
            result = [];
        sessions.forEach(session => {
            if (new Date(session.start).getDate() === startDate) {
                result.push(session);
            }
        });
        return result;
    }

    setSessionsAndPlaces(sessions) {
        const result = new Map();
        sessions.forEach(session => {
            if (!result.get(session.start)) {
                const init = [];
                init.push(session.place);
                result.set(session.start, {places: init, selectedIndex: 0});
            } else {
                const existingArray = result.get(session.start).places;
                existingArray.push(session.place);
                result.set(session.start, {places: existingArray, selectedIndex: 0});
            }
        });
        return result;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.completed) {
            const sessions = this.filterSessions(nextProps.conference, (nextProps.conference || []).sessions, 0);
            this.setState({
                conference: nextProps.conference,
                error: nextProps.error,
                completed: nextProps.completed,
                modal: false,
                selectedIndex: 0,
                sessions: sessions,
                sessionsAndPlaces: this.setSessionsAndPlaces((nextProps.conference || []).sessions),
                days: nextProps.conference ? this.getDaysOfConference(nextProps.conference) : []
            });
        }
    }

    render() {
        return (
            <View>
                {this.state.days.length > 1 && <SegmentedControlIOS
                    values={this.state.days}
                    selectedIndex={this.state.selectedIndex}
                    style={{backgroundColor: config.SECONDARY_BG_COLOR}}
                    onChange={(event) => {
                        this.setState({
                            selectedIndex: event.nativeEvent.selectedSegmentIndex,
                            sessions: this.filterSessions(this.props.conference, (this.props.conference || []).sessions, event.nativeEvent.selectedSegmentIndex)
                        });
                    }}
                />}
                <SectionList
                    renderItem={({item: session, index, section}) => {
                        const sessionsAndPlaces = this.state.sessionsAndPlaces.get(section.start),
                            currentPlace = sessionsAndPlaces.places[sessionsAndPlaces.selectedIndex];
                        if (currentPlace !== session.place) return null;
                        return <ListItem containerStyle={{borderLeftWidth: 6}} key={index}
                                         title={session.name} subtitle={session.speaker}
                                         onPress={() =>
                                             this.setState({
                                                 modal: true,
                                                 session: session,
                                                 section: null
                                             })
                                         }
                        />}
                    }
                    renderSectionHeader={({section}) => {
                        let promise;
                        const startDate = new Date(section.start),
                            isMultiPlaces = this.state.sessionsAndPlaces.get(section.start).places.length !== 1,
                            subTitle = isMultiPlaces ? "" : section.name,
                            placeSubtitle = isMultiPlaces ? <SegmentedControlIOS
                                style={{backgroundColor: "grey"}}
                                values={this.state.sessionsAndPlaces.get(section.start).places}
                                selectedIndex={this.state.sessionsAndPlaces.get(section.start).selectedIndex}
                                onChange={(event) => {
                                    clearTimeout(promise)
                                    const sessionsAndPlaces = this.state.sessionsAndPlaces;
                                    sessionsAndPlaces.set(section.start, {
                                        places: sessionsAndPlaces.get(section.start).places,
                                        selectedIndex: event.nativeEvent.selectedSegmentIndex
                                    });
                                    this.setState({
                                        sessionsAndPlaces: sessionsAndPlaces,
                                    });
                                }}
                            /> : section.place;
                        const sessionsAndPlaces = this.state.sessionsAndPlaces.get(section.start),
                            currentPlace = sessionsAndPlaces.places[sessionsAndPlaces.selectedIndex];
                        if (currentPlace !== section.place) return null;

                        return <ListItem title={startDate.toLocaleTimeString().substr(0, 5) + ' ' + subTitle}
                                         subtitle={placeSubtitle}
                                         containerStyle={{backgroundColor: config.SCHEDULE_HEADER_COLOR}}
                                         titleStyle={{
                                             color: config.PRIMARY_BG_COLOR,
                                             fontWeight: '800'
                                         }}
                                         chevronColor={config.SCHEDULE_HEADER_COLOR}
                                         stickySectionHeadersEnabled={true}
                                         onPress={() =>{
                                             promise = setTimeout( () =>
                                                     this.setState({
                                                         modal: true,
                                                         session: null,
                                                         section: section
                                                     }), 100)
                                         }}
                        />
                    }}
                    sections={this.state.sessions}
                    keyExtractor={(item, index) => item + index}/>

                {
                    <Modal isVisible={this.state.modal}
                           onSwipe={() => this.setState({modal: false})}
                           onBackdropPress={() => this.setState({modal: false})}>
                        {this.state.session &&
                        <Card title={(this.state.session.name || '').toUpperCase()}>
                            <View>
                                <Text
                                    style={{fontWeight: '700'}}>{this.state.session.place}</Text>
                                <Text
                                    style={{
                                        textAlign: 'justify',
                                        marginTop: 10
                                    }}>{this.state.session.description}</Text>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Text style={{fontWeight: '700'}}>Speaker: </Text>
                                    <Text>{this.state.session.speaker}</Text>
                                </View>
                            </View>
                        </Card>
                        }
                        {this.state.section &&
                        <Card title={(this.state.section.name || '').toUpperCase()}>
                            <View>
                                <Text
                                    style={{fontWeight: '700'}}>{this.state.section.place}</Text>
                                <Text
                                    style={{
                                        textAlign: 'justify',
                                        marginTop: 10
                                    }}>{this.state.section.description}</Text>
                                {this.state.section.moderators ?
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Text style={{fontWeight: '700'}}>Moderators: </Text>
                                    <Text>{this.state.section.moderators}</Text>
                                </View> : null}
                            </View>
                        </Card>}
                    </Modal>
                }
            </View>
        );
    }

}

ScheduleView.propTypes = {
    getInfo: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    conference: PropTypes.object.isRequired
};

export default ScheduleView;