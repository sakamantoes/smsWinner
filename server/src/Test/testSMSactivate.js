import smsActivateApi from "../utils/smsActivateApi.js";
import { env } from "../config/constant.js";


const testSMSActivate = async () => {
  try {

    // ACCOUNT BALANCE TEST
    const balance = await smsActivateApi.get(
      `/sms.php?action=account_balance&api_key=${env.smsActivateApiKey}`
    );

    console.log("BALANCE TEST");
    console.log(balance.data);

    // SERVICES TEST
    const services = await smsActivateApi.get(
      `/sms.php?action=get_services&api_key=${env.smsActivateApiKey}`
    );

    console.log("SERVICES TEST");
    console.log(services.data);

  } catch (error) {
    console.error("Error testing SMSActivate API:");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
};

testSMSActivate();