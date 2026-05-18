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

export const forgotPassword = async (data) => {
  const res = await api.post("api/auth/forgot/password", data);

  return res.data;
};

export const resetPassword = async (token, data) => {
  const res = await api.post(`api/auth/reset-password/${token}`, data);

  return res.data;
};

export const logout = async () => {
  const res = await api.post("api/auth/logout");
  return res.data;
};

export const VerifyCallback = async (data) => {
  const res = await api.post("api/payment/callback", data);

  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/api/auth/allUsers");

  return res.data;
};

export const activateUser = async (id) => {
  const res = await api.put(`/api/auth/activate/${id}`);

  return res.data;
};

export const deactivateUser = async (id) => {
  const res = await api.put(`/api/auth/deactivate/${id}`);

  return res.data;
};
