// middleware/verifyInternalSecret.js
export const verifyInternalSecret = (req, res, next) => {
  const secret = req.headers["x-internal-secret"];

  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    res.statusCode = 403;
    return next(new Error("Forbidden: invalid internal secret"));
  }

  next();
};