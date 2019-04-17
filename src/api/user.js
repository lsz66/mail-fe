import axios from 'axios';
import BASE_URL from './index';

const SERVICE_URL = '/user';

async function login(params) {
  return axios({
    url: `${BASE_URL}${SERVICE_URL}/login`,
    method: 'post',
    params,
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

export default {
  login,
  getName,
  logout,
  getOverview,
};
