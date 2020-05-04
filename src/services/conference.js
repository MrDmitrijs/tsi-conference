import config from '../config';

export default {
  getInfo: () => fetch("http://d7a1f23c.ngrok.io/api/conference/active", {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
  })
}