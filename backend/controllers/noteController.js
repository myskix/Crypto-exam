const db = require("../config/db");
const crypto = require("crypto"); // Library bawaan Node.js v24

// 1. Proses Simpan Soal (Poin 27: Proses Enkripsi)
exports.createNote = async (req, res) => {
  try {
    const { ciphertext, deadline, accessCode } = req.body;
    const userId = req.user.id; // Dari token
    const id = require("crypto").randomUUID();
    const hashedCode = require("crypto").createHash("sha256").update(accessCode).digest("hex");

    const query = "INSERT INTO notes (id, encrypted_content, access_code_hash, deadline, user_id) VALUES (?, ?, ?, ?, ?)";
    await db.execute(query, [id, ciphertext, hashedCode, deadline, userId]);

    res.status(201).json({ id, message: "Soal berhasil disimpan!" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menyimpan soal." });
  }
};

// 2. Proses Ambil Soal (Poin 29: Proses Dekripsi)
exports.getMyNotes = async (req, res) => {
  try {
    const userId = req.user.id; // Diambil dari token JWT
    const [rows] = await db.execute("SELECT id, deadline, created_at FROM notes WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil daftar soal." });
  }
};
