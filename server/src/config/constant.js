import { config } from "dotenv";
config();

export const env = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  mongodb_url: process.env.MONGODB_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  squad_api_key: process.env.SQUAD_API_KEY,
  squad_api_secret: process.env.SQUAD_API_SECRET,
};
