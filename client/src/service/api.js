import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 30000,
});

/**
 * intercept user reguest providing their token expires in an
 * authenticated screen and navigate them back to their login page
 */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    console.log("global error:", error);
    return Promise.reject(error);
  },
);

export default api;
