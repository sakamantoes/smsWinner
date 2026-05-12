import axios from "axios";
import { env } from "../config/constant.js";
import { smsBowerApi } from "../utils/smsbower.js";

const API_KEY = env.smsBowerApiKey;

const testSmsBower = async () => {
  try {
    const response = await smsBowerApi.get("", {
      params: {
        api_key: API_KEY,
        action: "getBalance",
      },
    });

    console.log("SMSBOWER RESPONSE:");
    console.log(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

testSmsBower();
