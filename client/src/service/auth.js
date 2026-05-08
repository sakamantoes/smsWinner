import api from "./api.js";

export const googleAuth = async (token) => {
  const res = await api.post("/auth/google", { token });

  return res;
};

export const getAuthUser = async () => {
  const res = await api.get("/auth/me");

  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/auth/login", data);

  return res;
};

export const signup = async (data) => {
  const res = await api.post("/auth/signup", data);

  return res;
};
