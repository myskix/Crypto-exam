import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import noteRoutes from "./routes/noteRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// 1. Middleware - Penting untuk CORS di Railway
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// 2. Routing
app.use("/notes", noteRoutes);

// Health check untuk Railway
app.get("/", (req, res) => {
  res.send("Server API Kriptografi Aktif!");
});

const PORT = process.env.PORT || 5001;

// 3. FIX: Simpan hasil app.listen ke dalam variabel 'server'
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 4. Penanganan Error - Sekarang variabel 'server' sudah didefinisikan
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ PORT ${PORT} sudah digunakan.`);
  } else {
    console.error("❌ SERVER ERROR:", err);
  }
});
