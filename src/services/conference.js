export default {
  getInfo: () => fetch("https://8d8768d5.ngrok.io/api/conference/active", {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
  }),

  saveDevice: id => fetch("http://8d8768d5.ngrok.io/api/conference/device", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: "deviceId=" + id + "&os=IOS&osVersion=10.5"
  }),

  saveFeedback: (id, star, feedback) => fetch("http://8d8768d5.ngrok.io/api/conference/feedback", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: "deviceId=" + id + "&os=IOS&osVersion=10.5"
  }),
}