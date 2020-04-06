import * as types from './types';
import info from "../../assets/conference";

export function conference() {
  return { type: types.INFO };
}

export function conferenceOk(payload) {
  return { type: types.INFO_OK, payload };
}

export function conferenceFail(error) {
  return { type: types.INFO_FAIL, error };
}

export function getInfo() {
  return (dispatch) => {
    return dispatch(conferenceOk(JSON.parse(JSON.stringify(info))));
  };
}