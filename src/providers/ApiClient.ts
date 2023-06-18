import axios from 'axios';

/**
 * memApiClient
 */
export const memApiClient = axios.create({
  baseURL: 'http://localhost:8080',
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

/**
 * comApiClient
 */
export const comApiClient = axios.create({
  baseURL: 'http://localhost:8081',
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});
