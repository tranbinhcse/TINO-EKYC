import axios from 'axios';
import ErrorHandler from './ErrorHandler';

// import { getItem } from '../../utility/localStorageControl';

const API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT;
 
const authHeader = () => ({
  Authorization: `Bearer ${getItem('access_token')}`,
  
});

const client = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  }, 
});

class ClientApi {
  
  static get(path = '', params = {}) {
    return client({
      method: 'GET',
      url: path,
      headers: { ...authHeader() },
      params: params,
    });
  }

  static post(path = '', data = {}, optionalHeader = {}) {
    return client({
      method: 'POST',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader },
    });
  }

  static patch(path = '', data = {}) {
    return client({
      method: 'PATCH',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static delete(path = '', data = {}) {
    return client({
      method: 'DELETE',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static put(path = '', data = {}) {
    return client({
      method: 'PUT',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }
}

/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use((config) => {
  // do something before executing the request
  // For example tag along the bearer access token to request header or set a cookie
  const requestConfig = config;
  const { headers } = config;
  
  requestConfig.headers = { ...headers };

  return requestConfig;
});
 

// Add a response interceptor to the axios instance
client.interceptors.response.use(response => {
  // If the response status is between 200 and 299, return the response data
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }

  // Otherwise, handle the error
  return ErrorHandler({ response });
}, error => {
  // Handle the error
  return Promise.reject(ErrorHandler(error));
});



export { ClientApi };
