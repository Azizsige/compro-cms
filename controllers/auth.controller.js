const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cek password yang dimasukkan dengan password yang ada di database
    const isPasswordValid = await bcrypt.compare(password, user.password); // compare langsung tanpa hash lagi
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Password yang kamu masukkan salah!" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Ambil token tanpa "Bearer "
    const strippedToken = token.replace("Bearer ", "");

    // Verifikasi token untuk mendapatkan waktu kedaluwarsa
    const decoded = jwt.verify(strippedToken, process.env.JWT_SECRET);

    // Simpan token ke database
    const blacklistedToken = new BlacklistedToken({
      token: strippedToken,
      expiresAt: new Date(decoded.exp * 1000), // Konversi ke milidetik
    });
    await blacklistedToken.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token already expired." });
    }
    return res.status(400).json({ message: "Invalid token." });
  }
};
