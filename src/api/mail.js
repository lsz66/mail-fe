import axios from 'axios';
import BASE_URL from './index';

const SERVICE_URL = '/mail';

async function getTotalCount(box) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/count/${box}`,
    method: 'get',
  });
}

async function getList(box, pageNo) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/list/${box}/${pageNo}`,
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
    url: `${BASE_URL}${SERVICE_URL}/msg/${box}/${id}`,
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
    url: `${BASE_URL}${SERVICE_URL}/${src}/${dest}`,
    method: 'put',
    data,
  });
}

async function del(data, box) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/${box}`,
    method: 'delete',
    data,
  });
}

async function search(box, pattern) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/listCond/${box}/${pattern}`,
    method: 'get',
  });
}

async function markAs(box, data, type) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/${box}/${type}`,
    method: 'patch',
    data,
  });
}

export default {
  getTotalCount,
  getList,
  send,
  read,
  setSeen,
  move,
  del,
  search,
  markAs,
};
