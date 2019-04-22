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

async function setSeen(data) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}`,
    method: 'put',
    data,
  });
}

async function move(data, src, dest) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/move/${src}/${dest}`,
    method: 'put',
    data,
  });
}

async function del(data, box) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/delete/${box}`,
    method: 'delete',
    data,
  });
}

export default {
  getList,
  send,
  read,
  setSeen,
  move,
  del,
};
