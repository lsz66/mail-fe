import axios from 'axios';
import BASE_URL from './index';

async function getInbox() {
  return axios({
    url: `${BASE_URL}/getInboxList`,
    method: 'get',
  });
}

export default {
  getInbox,
};
