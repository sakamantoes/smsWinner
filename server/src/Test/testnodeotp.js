import nodeApi from "../utils/nodeOtpApi.js"; 

const testNodeOtp = async () => {
  try {

    const balance = await nodeApi.get("/balance");

    console.log("BALANCE TEST");
    console.log(balance.data);

    const services = await nodeApi.get("/services");

    console.log("SERVICES TEST");
    console.log(services.data);

    const countries = await nodeApi.get("/countries");

    console.log("COUNTRIES TEST");
    console.log(countries.data);

  } catch (error) {

    console.log("NODEOTP API ERROR");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    } else {
      console.log(error.message);
    }
  }
};

testNodeOtp();