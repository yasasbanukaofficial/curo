import axios from 'axios';
import { API_URL } from '../services/env.js';
import { getToken } from '../services/token.js';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Cookie = `access_token=${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { clearAll } = require('../services/token.js');
      clearAll();
    }
    return Promise.reject(error);
  },
);

export default client;
