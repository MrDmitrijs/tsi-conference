import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { getInfo } from '../../reducers/ConferenceReducer/actions';
import config from '../../config';

const mapStateToProps = state => ({
    ...state.conference
});

const mapDispatchToProps = dispatch => ({
    getInfo: () => {
        dispatch(getInfo());
    }
});

class Header extends Component {

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
            <View style={{flex:1, alignItems: "center", backgroundColor: "#2c4573"}}>
                <Text style={{color: config.SECONDARY_BG_COLOR, fontSize: 18, fontWeight: "700"}}>{this.state.conferenceInfo.name}</Text>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);