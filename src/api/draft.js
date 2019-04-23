import axios from 'axios';
import BASE_URL from './index';

const SERVICE_URL = '/draft';

async function getList() {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/getList`,
    method: 'get',
  });
}

async function getById(params) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/getById/${params}`,
    method: 'get',
  });
}

async function save(data) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}`,
    method: 'post',
    data,
  });
}

async function update(data) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}`,
    method: 'put',
    data,
  });
}

async function del(id) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/${id}`,
    method: 'delete',
  });
}

async function delByList(data) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/list`,
    method: 'delete',
    data,
  });
}

export default {
  getList,
  getById,
  save,
  update,
  del,
  delByList,
};
