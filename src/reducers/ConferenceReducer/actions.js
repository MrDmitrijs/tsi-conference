import * as types from './types';
import service from "../../services/conference";
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
    return dispatch => {
        return dispatch(conferenceOk(JSON.parse(JSON.stringify(info))));
    };
}

export function saveFeedback(star, comment) {
    console.log("going to save feedback " + star + "; " + comment);
    return dispatch => {
        service.saveFeedback(id)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }
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