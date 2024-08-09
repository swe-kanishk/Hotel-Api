const AppError = require("../utils/errorUtil.js");
const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError("Unauthenticated, please login again", 404));
  }

  try {
    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;
    next();
  } catch (err) {
    return next(new AppError("Invalid token, please login again", 401));
  }
};

module.exports = isLoggedIn;
