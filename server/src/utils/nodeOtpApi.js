import axios from 'axios';
import { env } from '../config/constant.js';

const API_KEY = env.nodeApiKey;

const nodeApi = axios.create({
    baseURL:  "https://nodeotp.com/api/v1",
    headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    },
})

export default nodeApi;