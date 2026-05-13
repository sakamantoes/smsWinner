import api from "./api";

export const getWalletBalance = async () => {
    const res = await api.get("/api/wallet/balance");

    return res.data
}