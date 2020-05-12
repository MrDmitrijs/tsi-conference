import React, {Component} from 'react';
import {ActivityIndicator, SectionList, Text, View, TextInput, Button} from 'react-native';
import StarRating from 'react-native-star-rating';
import SegmentedControlIOS from "@react-native-community/segmented-control";
import {Card, ListItem} from 'react-native-elements';
import Modal from 'react-native-modal';
import config from '../../../config';

class ScheduleView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conferenceInfo: {sections: []},
            session: {},
            section: {},
            loading: true,
            error: false,
            modal: false,
            sections: [],
            sectionsAndPlaces: new Map(),
            sessionAndStarsWithComments: new Map(),
            selectedIndex: 0,
            days: []
        };
    }

    componentDidMount() {
        const {getInfo, saveDevice} = this.props;
        getInfo();
        saveDevice("asdghjaksd-dsaasd-123123-asdds");
        this.setState({
            session: {},
            modal: false,
            sections: []
        })
    }

    getDaysOfConference(conferenceInfo) {
        const startDate = new Date(conferenceInfo.start),
            endDate = new Date(conferenceInfo.end),
            result = [];
        for (let i = 0; i <= endDate.getDate() - startDate.getDate();) {
            let numberOfTheDay = i + 1;
            result.push('DAY ' + numberOfTheDay);
            i++;
        }
        return result;
    }

    filterSessions(conferenceInfo, sections, selectedIndex) {
        const daysNumber = this.getDaysOfConference(conferenceInfo).length;
        if (!daysNumber) return sections;

        const startDate = new Date(conferenceInfo.start).getDate() + selectedIndex,
            result = [];
        sections.forEach(session => {
            if (new Date(session.start).getDate() === startDate) {
                result.push(session);
            }
        });
        return result;
    }

    setSessionsAndPlaces(sections) {
        const result = new Map();
        if (!sections) return result;
        sections.forEach(session => {
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

    setSessionAndStarsWithComments(sections) {
        const result = new Map();
        if (!sections) return result;
        sections.forEach(session => {
            session.data.forEach(lecture => {
                    result.set(lecture.id, {rate: 3, comment: ""})
                }
            )
        });
        return result;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.completed) {
            const sections = this.filterSessions(nextProps.conferenceInfo, (nextProps.conferenceInfo || []).sections, 0);
            this.setState({
                conferenceInfo: nextProps.conferenceInfo,
                error: nextProps.error,
                completed: nextProps.completed,
                modal: false,
                selectedIndex: 0,
                loading: nextProps.loading,
                sections: sections,
                sessionAndStarsWithComments: this.setSessionAndStarsWithComments((nextProps.conferenceInfo || []).sections),
                sectionsAndPlaces: this.setSessionsAndPlaces((nextProps.conferenceInfo || []).sections),
                days: nextProps.conferenceInfo ? this.getDaysOfConference(nextProps.conferenceInfo) : []
            });
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{justifyContent: "center"}}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        } else if (this.state.error) {
            return (
                <View>
                    Error occurred!dd
                </View>
            )
        } else {
            return (
                <View>
                    {this.state.days.length > 1 && <SegmentedControlIOS
                        values={this.state.days}
                        selectedIndex={this.state.selectedIndex}
                        style={{backgroundColor: config.SECONDARY_BG_COLOR}}
                        onChange={(event) => {
                            this.setState({
                                selectedIndex: event.nativeEvent.selectedSegmentIndex,
                                sections: this.filterSessions(this.props.conferenceInfo, (this.props.conferenceInfo || []).sections, event.nativeEvent.selectedSegmentIndex)
                            });
                        }}
                    />}
                    <SectionList
                        renderItem={({item: session, index, section}) => {
                            const sectionsAndPlaces = this.state.sectionsAndPlaces.get(section.start),
                                currentPlace = sectionsAndPlaces.places[sectionsAndPlaces.selectedIndex];
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
                            />
                        }
                        }
                        renderSectionHeader={({section}) => {
                            let promise;
                            const startDate = new Date(section.start),
                                isMultiPlaces = this.state.sectionsAndPlaces.get(section.start).places.length !== 1,
                                subTitle = isMultiPlaces ? "" : section.name,
                                placeSubtitle = isMultiPlaces ? <SegmentedControlIOS
                                    style={{backgroundColor: "grey"}}
                                    values={this.state.sectionsAndPlaces.get(section.start).places}
                                    selectedIndex={this.state.sectionsAndPlaces.get(section.start).selectedIndex}
                                    onChange={(event) => {
                                        clearTimeout(promise);
                                        const sectionsAndPlaces = this.state.sectionsAndPlaces;
                                        sectionsAndPlaces.set(section.start, {
                                            places: sectionsAndPlaces.get(section.start).places,
                                            selectedIndex: event.nativeEvent.selectedSegmentIndex
                                        });
                                        this.setState({
                                            sectionsAndPlaces: sectionsAndPlaces,
                                        });
                                    }}
                                /> : section.place;
                            const sectionsAndPlaces = this.state.sectionsAndPlaces.get(section.start),
                                currentPlace = sectionsAndPlaces.places[sectionsAndPlaces.selectedIndex];
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
                                             onPress={() => {
                                                 promise = setTimeout(() =>
                                                     this.setState({
                                                         modal: true,
                                                         session: null,
                                                         section: section
                                                     }), 100)
                                             }}
                            />
                        }}
                        sections={this.state.sections}
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

                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <StarRating
                                            disabled={false}
                                            maxStars={5}
                                            rating={(this.state.sessionAndStarsWithComments.get(this.state.session.id) || 3).rate}
                                            selectedStar={(rating) => {
                                                const sessionAndStarsWithComments = this.state.sessionAndStarsWithComments;
                                                sessionAndStarsWithComments.set(this.state.session.id, {
                                                    rate: rating,
                                                    comment: sessionAndStarsWithComments.get(this.state.session.id).comment
                                                });
                                                this.setState(
                                                    sessionAndStarsWithComments
                                                )
                                            }}
                                        />
                                    </View>

                                    <TextInput
                                        style={{
                                            height: 100,
                                            borderColor: 'gray',
                                            borderWidth: 1,
                                            flexDirection: 'row',
                                            marginTop: 10
                                        }}
                                        value={"" + (this.state.sessionAndStarsWithComments.get(this.state.session.id) || "").comment}
                                        multiline
                                        onChangeText={(text) => {
                                            const sessionAndStarsWithComments = this.state.sessionAndStarsWithComments;
                                            sessionAndStarsWithComments.set(this.state.session.id, {
                                                rate: sessionAndStarsWithComments.get(this.state.session.id).rate,
                                                comment: text
                                            });
                                            this.setState(
                                                sessionAndStarsWithComments
                                            )
                                        }}
                                    />

                                    <Button
                                        title="Save"
                                        style={{flexDirection: 'row', marginTop: 10}}
                                        onClick={() => this.setState({modal: false})}
                                    />
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
}

export default ScheduleView;