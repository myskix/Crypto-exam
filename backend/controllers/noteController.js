const db = require("../config/db");
const crypto = require("crypto");

// 1. Simpan Soal (Update: Terima Title)
exports.createNote = async (req, res) => {
  try {
    // Terima title dari body
    const { title, ciphertext, deadline, accessCode } = req.body;
    const userId = req.user.id;

    const id = crypto.randomUUID();
    const hashedCode = crypto.createHash("sha256").update(accessCode).digest("hex");

    // Masukkan title ke query
    const query = "INSERT INTO notes (id, title, encrypted_content, access_code_hash, deadline, user_id) VALUES (?, ?, ?, ?, ?, ?)";
    await db.execute(query, [id, title, ciphertext, hashedCode, deadline, userId]);

    res.status(201).json({ id, message: "Ujian berhasil dibuat!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menyimpan soal." });
  }
};

// 2. Dashboard (Update: Ambil Title)
exports.getMyNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    // SELECT title juga
    const [rows] = await db.execute("SELECT id, title, deadline, created_at FROM notes WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data." });
  }
};

// 3. Ambil Soal (Untuk Mahasiswa - Tidak berubah banyak)
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM notes WHERE id = ?", [id]);

    if (rows.length === 0) return res.status(404).json({ message: "Soal tidak ditemukan." });

    const note = rows[0];
    // Validasi waktu di sini... (kode lama)

    res.json({
      title: note.title, // Kirim judul juga
      ciphertext: note.encrypted_content,
      access_code_hash: note.access_code_hash,
      deadline: note.deadline,
    });
  } catch (error) {
    res.status(500).json({ error: "Error mengambil soal." });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Pastikan hanya pemilik yang bisa hapus

    // Hapus note (Submissions akan terhapus otomatis karena CASCADE)
    await db.execute("DELETE FROM notes WHERE id = ? AND user_id = ?", [id, userId]);

    res.json({ message: "Ujian berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus ujian." });
  }
};
