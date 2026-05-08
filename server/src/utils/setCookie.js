export const setAuthCookie = (res, token) => {
  res.cookie("smsWinnerToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
