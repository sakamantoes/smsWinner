export const setAuthCookie = (res, token) => {
  res.cookie("smsWinnerToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
