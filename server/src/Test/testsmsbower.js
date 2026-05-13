import axios from "axios";
import { env } from "../config/constant.js";

const API_KEY = env.smsBowerApiKey;

// CREATE AXIOS INSTANCE HERE
const smsBowerApi = axios.create({
  baseURL: "https://smsbower.page/stubs/handler_api.php",
  timeout: 10000,
});

// GET SMSBOWER BALANCE
const getSmsBowerBalance = async () => {
  try {
    console.log("🔍 Checking SMSBower balance...");

    const response = await smsBowerApi.get("", {
      params: {
        api_key: API_KEY,
        action: "getBalance",
      },
    });

    const data = response.data;

    console.log("📦 Raw Response:", data);

    // SUCCESS RESPONSE
    if (typeof data === "string" && data.startsWith("ACCESS_BALANCE")) {
      const balance = data.split(":")[1];

      console.log(`✅ SMSBower Balance: ${balance}`);

      return {
        success: true,
        balance,
      };
    }

    // INVALID API KEY
    if (data === "BAD_KEY") {
      console.log("❌ Invalid SMSBower API Key");

      return {
        success: false,
        message: "Invalid API Key",
      };
    }

    // UNKNOWN RESPONSE
    return {
      success: false,
      message: data,
    };
  } catch (error) {
    console.log("❌ SMSBower Error:");

    console.log(error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data || error.message,
    };
  }
};

// RUN FUNCTION
getSmsBowerBalance();