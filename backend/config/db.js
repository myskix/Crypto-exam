import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); // Penting: load file .env

const db = mysql.createPool({
  // Prioritas: Ambil dari Environment Variable, kalau tidak ada baru pakai default lokal
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "crypto_exam_db",
  port: process.env.MYSQLPORT || 28280,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, conn) => {
  if (err) console.error("Koneksi Database GAGAL:", err);
  else {
    console.log("Terhubung ke Database!");
    conn.release();
  }
});

export default db;
