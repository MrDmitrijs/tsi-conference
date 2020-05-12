import { connect } from 'react-redux';
import ScheduleView from './ScheduleView';
import { getInfo, registerDevice } from '../../../reducers/ConferenceReducer/actions';

const mapStateToProps = state => ({
  ...state.conference
});

const mapDispatchToProps = dispatch => ({
  getInfo: () => {
    dispatch(getInfo());
  },
  saveDevice: id => {
    dispatch(registerDevice(id))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleView);