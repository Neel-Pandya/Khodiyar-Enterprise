import axios from 'axios';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // Standardize error messaging
        let message = 'An error occurred.';
        let statusCode = null;
        let metadata = null;

        if (error.response) {
          statusCode = error.response.status;
          const data = error.response.data;

          if (typeof data === 'string') {
            message = data;
          } else if (data.message) {
            message = data.message;
          } else if (data.error) {
            message = data.error;
          }

          // Preserve metadata if available
          if (data.metadata) {
            metadata = data.metadata;
          }
        } else if (error.message) {
          message = error.message;
        }

        const err = new Error(message);
        err.statusCode = statusCode;
        err.metadata = metadata;
        err.original = error;
        throw err;
      }
    );
  }

  get(url, config = {}) {
    return this.client.get(url, config);
  }

  post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  patch(url, data, config = {}) {
    return this.client.patch(url, data, config);
  }

  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

export default new ApiClient();