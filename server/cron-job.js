import mongoose from "mongoose";
import { env } from "./src/config/constant.js";
import axios from "axios";
import { services } from "./src/utils/neededCountries.js";
import AvailableService from "./src/model/ServicesAvailable.js";

const MAX_ALLOWED_PRICE = 3;

const CronJob = async () => {
  console.log("Starting up Node-Crun");
  try {
    console.log("connecting to mongoDb.....");
    await mongoose.connect(env.mongodb_url);
    console.log("MongoDB connected successfully");

    let arr = [];

    await Promise.all(
      services.map(async (item) => {
        const response = await axios.get(
          `https://smsbower.page/stubs/handler_api.php?api_key=${env.sms_bower_api_key}&action=getPricesV3&service=${item.service}&country=${item.countryId}`,
        );

        for (const countryId in response.data) {
          const services = response.data[countryId];

          for (const serviceCode in services) {
            const providers = services[serviceCode];

            for (const providerKey in providers) {
              const details = providers[providerKey];

              // special rule for US numbers
              // global rule for others
              if (details.price > MAX_ALLOWED_PRICE) {
                continue;
              }

              // console.log(
              //   `low product saved :`,
              //   serviceCode + " " + details.price + " " + countryId,
              // );

              arr.push({
                updateOne: {
                  filter: {
                    service: serviceCode,
                    country: countryId,
                    provider: "smsbower",
                    providerId: Number(providerKey),
                  },

                  update: {
                    $set: {
                      providerPrice: details.price,
                      stock: details.count,
                      providerId: Number(providerKey),
                      lastFetchedAt: new Date(),
                    },
                  },

                  upsert: true,
                },
              });
            }
          }
        }
      }),
    );

    await AvailableService.bulkWrite(arr);

    console.log(
      `cron job ran successfully and Prepared ${arr.length} operations`,
    );
  } catch (err) {
    console.error("node cron: ", err);
  }
};

export default CronJob;
