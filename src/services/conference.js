import config from '../config';

export default {
  getInfo: () => fetch(`${config.API_URL}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
  })
}