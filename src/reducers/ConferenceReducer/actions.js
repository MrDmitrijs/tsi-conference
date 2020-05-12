import * as types from './types';
import service from "../../services/conference";

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
  return dispatch => {
    const response = service.getInfo();
    response.then(response => response.json())
        .then(responseJson => {
          return dispatch(conferenceOk(responseJson));
        })
        .catch(error => {
          return conferenceFail(error)
        })
  };
}

export function registerDevice(id) {
    console.log("going to registerDevice " + id)
    return dispatch => {
        service.saveDevice(id)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }
}