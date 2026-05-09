import axios from "axios";

const smsActivateApi = axios.create({
  baseURL: "https://www.smsactivate.com/api",
  timeout: 15000,
});

export default smsActivateApi;