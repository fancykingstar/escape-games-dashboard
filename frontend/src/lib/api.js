import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

export { api };