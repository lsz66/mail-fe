import axios from 'axios';
import BASE_URL from './index';

const SERVICE_URL = '/mail';

async function getInbox() {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/getInbox`,
    method: 'get',
  });
}

async function getOutbox() {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/getOutbox`,
    method: 'get',
  });
}

async function send(data) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}`,
    method: 'post',
    data,
  });
}
export default {
  getInbox,
  getOutbox,
  send
};
