import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import noteRoutes from "./routes/noteRoutes.js";

// const noteRoutes = require("./routes/noteRoutes");
dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// Routing
app.use("/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("Server API Kriptografi Aktif!");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  // '0.0.0.0' penting untuk cloud hosting
  console.log(`Server running on port ${PORT}`);
});

// Penanganan Error agar server tidak langsung mati tanpa pesan
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ PORT ${PORT} sudah digunakan. Tutup server lain atau ganti port di .env`);
  } else {
    console.error("❌ SERVER ERROR:", err);
  }
});
