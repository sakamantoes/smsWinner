import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

const nodeApi = axios.create({
    baseURL:  "https://nodeotp.com/api/v1",
    headers: {
        "Authorization": `Bearer ${process.env.NODEOTP_API_KEY}`,
        "Content-Type": "application/json",
    },
})

export default nodeApi;