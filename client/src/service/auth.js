import api from "./api.js";

export const googleAuth = async (token) => {
  const res = await api.post("/auth/google", { token });

  return res;
};

export const getAuthUser = async () => {
  const res = await api.get("/auth/me");

  return res.data;
};
