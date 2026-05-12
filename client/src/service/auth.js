import api from "./api.js";

export const googleAuth = async (token) => {
  const res = await api.post("api/auth/google", { token });

  return res;
};

export const getAuthUser = async () => {
  const res = await api.get("api/auth/me");

  return res.data;
};

export const login = async (data) => {
  const res = await api.post("api/auth/login", data);

  return res.data;
};

export const signup = async (data) => {
  const res = await api.post("api/auth/signup", data);

  return res.data;
};


export const VerifyCallback = async (data) => {
  const res = await api.post("api/payment/callback", data);

  return res.data;
}