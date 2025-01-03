const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const strippedToken = token.replace("Bearer ", "");

    // Periksa apakah token ada di database blacklist
    const isBlacklisted = await BlacklistedToken.findOne({
      token: strippedToken,
    });
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Token expired. Please login again." });
    }

    // Verifikasi token
    const decoded = jwt.verify(strippedToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please login again." });
    }
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
