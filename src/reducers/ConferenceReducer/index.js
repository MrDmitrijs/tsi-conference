import * as types from './types';

const init = {
  loading: false,
  conferenceInfo: {},
  error: false,
  completed: false,
  detail: undefined
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case types.INFO:
      return {
        ...state,
        loading: true,
        error: false,
        conferenceInfo: {},
        completed: false,
        detail: undefined
      };
    case types.INFO_OK:
      return {
        ...state,
        loading: false,
        error: false,
        conferenceInfo: action.payload.conferenceInfo,
        completed: true,
        detail: undefined
      };
    case types.INFO_FAIL:
      return {
        ...state,
        loading: false,
        conferenceInfo: {},
        error: true,
        completed: true,
        detail: action.error
      };
    default:
      return state;
  }
};

export default reducer;