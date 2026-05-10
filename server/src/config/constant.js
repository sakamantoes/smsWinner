import { config } from "dotenv";
config();

export const env = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  mongodb_url: process.env.MONGODB_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  nodeApiKey: process.env.NODEOTP_API_KEY,
  smsActivateApiKey: process.env.SMS_ACTIVATE_API_KEY,
};
