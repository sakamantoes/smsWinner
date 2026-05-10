import axios from "axios";

const initialiseDeposite = async (req, res, next) => {
  const { amount } = req.body;
  const user = req.user;
  try {
    const pay = axios.post(
      "https://apibox.alatpay.ng/merchant-onboarding/api/v1/payment/initialize",
      {
        email: user.email,
        redirectUrl: "http://localhost:5173/",
        amount,
        currency: 2,
      },
    );
  } catch (error) {
    next(error);
  }
};
