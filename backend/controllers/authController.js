const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    res.status(201).json({ message: "Dosen berhasil terdaftar!" });
  } catch (error) {
    res.status(500).json({ error: "Username sudah digunakan atau server error." });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).json({ error: "Username atau Password salah!" });
    }

    // Buat token JWT agar dosen tetap login di browser
    const token = jwt.sign({ id: rows[0].id }, "RAHASIA_NEGARA", { expiresIn: "1d" });
    res.json({ token, username: rows[0].username });
  } catch (error) {
    res.status(500).json({ error: "Gagal login." });
  }
};
