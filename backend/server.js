const express = require("express");
const cors = require("cors");
require("dotenv").config();
const noteRoutes = require("./routes/noteRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routing
app.use("/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("Server API Kriptografi Aktif!");
});

const PORT = process.env.PORT || 5001;

// PERBAIKAN: Gunakan 'const server =' agar variabel terdefinisi
const server = app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log("Tekan Ctrl+C untuk mematikan server.");
});

// Penanganan Error agar server tidak langsung mati tanpa pesan
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ PORT ${PORT} sudah digunakan. Tutup server lain atau ganti port di .env`);
  } else {
    console.error("❌ SERVER ERROR:", err);
  }
});
