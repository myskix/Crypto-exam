import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Data tidak lengkap" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.status(201).json({ message: "Registrasi berhasil!" });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Username sudah dipakai." });
    }
    res.status(500).json({ error: "Server error saat register." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(400).json({ error: "Username tidak ditemukan." });

    // Cek password
    const validPass = await bcrypt.compare(password, rows[0].password);
    if (!validPass) return res.status(400).json({ error: "Password salah." });

    // Buat Token
    const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, "RAHASIA_NEGARA", { expiresIn: "24h" });

    res.json({ token, username: rows[0].username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error saat login." });
  }
};
