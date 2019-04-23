import axios from 'axios';
import BASE_URL from './index';

const SERVICE_URL = '/user';

async function login(data) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/login`,
    method: 'post',
    data,
  });
}

async function register(data) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/register`,
    method: 'post',
    data,
  });
}

async function getBanner() {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/getBanner`,
    method: 'get',
  });
}

async function getName() {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/getName`,
    method: 'get',
  });
}

async function logout() {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/logout`,
    method: 'get',
  });
}

async function getOverview() {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/overview`,
    method: 'get',
  });
}

async function updateName(params) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/updateName`,
    method: 'put',
    params,
  });
}

async function updateInfo(data) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/updateInfo`,
    method: 'put',
    data,
  });
}

async function getDateCount() {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/dateCount`,
    method: 'get',
  });
}

export default {
  login,
  register,
  getBanner,
  getName,
  logout,
  getOverview,
  updateName,
  updateInfo,
  getDateCount,
};
