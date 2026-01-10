const db = require("../config/db");
const crypto = require("crypto"); // Library bawaan Node.js v24

// 1. Proses Simpan Soal (Poin 27: Proses Enkripsi)
exports.createNote = async (req, res) => {
  try {
    const { ciphertext, deadline, accessCode } = req.body;

    // Generate ID unik menggunakan UUID untuk link (Poin 28: Distribusi Kunci)
    const id = crypto.randomUUID();

    // Hash Access Code menggunakan SHA-256 (Poin 9: Hashing)
    // Agar server tidak menyimpan PIN asli mahasiswa
    const hashedCode = crypto.createHash("sha256").update(accessCode).digest("hex");

    const query = "INSERT INTO notes (id, encrypted_content, access_code_hash, deadline) VALUES (?, ?, ?, ?)";
    await db.execute(query, [id, ciphertext, hashedCode, deadline]);

    res.status(201).json({ id, message: "Soal berhasil disimpan dalam bentuk ciphertext!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menyimpan soal ke database." });
  }
};

// 2. Proses Ambil Soal (Poin 29: Proses Dekripsi)
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM notes WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Soal tidak ditemukan." });
    }

    const note = rows[0];
    const now = new Date();

    // Validasi Waktu (Poin 21: Integrity)
    if (now > new Date(note.deadline)) {
      return res.status(403).json({ message: "Waktu ujian telah berakhir!" });
    }

    // Kirim ciphertext ke mahasiswa untuk didekripsi di browser mereka
    res.json({
      ciphertext: note.encrypted_content,
      access_code_hash: note.access_code_hash,
      deadline: note.deadline,
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data soal." });
  }
};
