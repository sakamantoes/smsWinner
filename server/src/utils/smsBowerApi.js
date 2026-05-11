// utils/smsBowerApi.js
import axios from "axios";

const smsBowerApi = axios.create({
  baseURL: process.env.SMS_BOWER_API_URL || "https://smsbower.page",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for logging
smsBowerApi.interceptors.response.use(
  (response) => {
    console.log(`SMSBower API [${response.config.method?.toUpperCase()}]: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error("SMSBower API Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default smsBowerApi;