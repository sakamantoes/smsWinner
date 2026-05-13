const getUserWalletBalance = async (req, res, next) => {
  const user = req.user;
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.statusCode = 401;
      throw new Error("User not found");
    }

    const walletBalance = await Wallet.findOne({ user: user._id });

    res.status(200).json({
      success: true,
      message: "Wallet balance fetched successfully",
      data: walletBalance,
    });
  } catch (error) {
    next(error);
  }
};

export { getUserWalletBalance };
