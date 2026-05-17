import api from "./api.js";

export const getPlatformDeposits = async () => {
  const res = await api.post("/api/admin/deposit");

  return res.data;
};

export const updatePlatformDepositStatus = async (id, status) => {
  const res = await api.patch(`/api/admin/deposit/${id}`, {
    status: String(status).toLowerCase(),
  });

  return res.data;
};

export const updatePricingSettings = async (data) => {
  try {
    const response = await api.post("/api/admin/pricing/setting", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getOtpOrder = async () => {
  const res = await api.get("/api/admin/pending/otp");

  console.log(res.data);
  return res.data;
};
