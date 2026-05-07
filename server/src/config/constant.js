import { config } from "dotenv";
config();

export const env = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  mongodb_url: process.env.MONGODB_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.GOOGLE_CLIENT_SECRET,
};
