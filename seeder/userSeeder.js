const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const config = require("../config");
const User = require("../models/User"); // Path ke model User

dotenv.config(); // Load environment variables

const seedSuperAdmin = async () => {
  try {
    // Koneksi ke database
    await mongoose.connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Periksa apakah Super Admin sudah ada
    const existingUser = await User.findOne({
      email: "adminsuper@example.com",
    });
    if (existingUser) {
      console.log("Super Admin already exists!");
    } else {
      // Buat password terenkripsi
      const hashedPassword = await bcrypt.hash("@Password!1", 10);

      // Tambahkan user Super Admin
      await User.create({
        username: "superadmin",
        email: "adminsuper@example.com",
        password: hashedPassword,
      });

      console.log("Super Admin created successfully!");
    }

    // Tutup koneksi database
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding Super Admin:", error);
    mongoose.connection.close();
  }
};

seedSuperAdmin();
