import axios from "axios";

export default function authAxios(authToken) {
  const _axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  _axios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${authToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  _axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const code = error && error.response ? error.response.status : 0;
      if (code === 401 || code === 403) {
        console.log("error code", code);
      }
      return Promise.reject(error);
    },
  );
}
