import axios from 'axios';
import BASE_URL from './index';

async function login(params) {
  return axios({
    url: `${BASE_URL}/user/login`,
    method: 'post',
    params,
  });
}

async function getName() {
  return axios({
    url: `${BASE_URL}/user/getName`,
    method: 'get',
  });
}

async function logout() {
  return axios({
    url: `${BASE_URL}/user/logout`,
    method: 'get',
  });
}

export default {
  login,
  getName,
  logout,
};
