import api from "./api.js";

export const initializeSquadPayment = async (data) => {
  const res = await api.post("/api/payment/squad/initialize-deposit", data);

  return res.data;
};

export const getSquadPaymentStatus = async (data) => {
  const res = await api.post(`/api/payment/status`, data);
  console.log("reference error", res.data);

  return res.data;
};

export const manualBankPayment = async (data) => {
  const res = await api.post("/api/payment/manual/initialize-deposit", data);

  return res.data;
};

export const getAlluserPurchaseReceipt = async () => {
  const res = await api.get("/api/user/purchase/receipt");

  return res.data;
};