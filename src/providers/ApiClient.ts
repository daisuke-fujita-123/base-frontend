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
 * traApiClient
 */
export const traApiClient = axios.create({
  baseURL: 'http://localhost:8081',
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

/**
 * docApiClient
 */
export const docApiClient = axios.create({
  baseURL: 'http://localhost:8082',
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
  baseURL: 'http://localhost:8083',
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

/**
 * _expApiClient
 */
export const _expApiClient = axios.create({
  baseURL: 'http://localhost:8084',
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});
