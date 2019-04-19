import axios from 'axios';
import BASE_URL from './index';

const SERVICE_URL = '/mail';

async function getList(box) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/getList/${box}`,
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

async function read(box, id) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/getMsg/${box}/${id}`,
    method: 'get',
  });
}
export default {
  getList,
  send,
  read,
};
