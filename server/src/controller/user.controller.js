import User from "../model/User.js";

const getUserWalletBalance = async (req, res, next) => {
  const user = req.user;
  try {
    const userExist = await User.findById({ _id: user._id });

    if (!userExist) {
      res.statusCode = 401;
      throw new Error("User not found");
    }


    res.status(200).json({
      success: true,
      message: "Wallet balance fetched successfully",
      data: userExist.walletBalance,
    });
  } catch (error) {
    next(error);
  }
};

export { getUserWalletBalance };
