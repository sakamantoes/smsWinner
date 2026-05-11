
import api from "./api.js";

export const initializeSquadPayment = async (data) => {
  const res = await api.post("/payment/squad/initialize-deposit", data);

  return res.data;
};

