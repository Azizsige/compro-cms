const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // Middleware autentikasi

// Endpoint Login
router.post("/login", authController.login);

// Endpoint Logout
router.post("/logout", authMiddleware, authController.logout);

// dummy route
router.get("/test-auth", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "AuthMiddleware bekerja dengan baik!",
    user: req.user, // Data pengguna yang diambil dari token
  });
});

module.exports = router;
