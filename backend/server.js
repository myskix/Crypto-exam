const express = require("express");
const cors = require("cors");
require("dotenv").config();
const noteRoutes = require("./routes/noteRoutes");
const mysql = require("mysql2");

const app = express();

//koneksi db
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

db.getConnection((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ MySQL Railway Connected");
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routing
app.use("/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("Server API Kriptografi Aktif!");
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`✅ Server berjalan di ${PORT}`);
});

// Penanganan Error agar server tidak langsung mati tanpa pesan
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ PORT ${PORT} sudah digunakan. Tutup server lain atau ganti port di .env`);
  } else {
    console.error("❌ SERVER ERROR:", err);
  }
});
