const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const config = require("./config");

// Routes
const authRoutes = require("./routes/auth.route");
// const roleRoutes = require("./routes/roleRoutes");
// const userRoutes = require("./routes/userRoute");

app.use(express.json());
app.use(cors());
// app.use(
//   session({
//     secret: "loremipsum",
//     resave: true,
//     saveUnitialized: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
//   })
// );

// URL Routes
// Routes
app.use("/api/auth", authRoutes);
// app.use("/api", roleRoutes);
// app.use("/api", userRoutes);

mongoose
  .connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    serverSelectionTimeoutMS: 50000,
  })
  .then(() => {
    console.log("Connected to DB");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });

module.exports = app;
