const db = require("../config/db");

exports.submitExam = async (req, res) => {
  try {
    // 1. Ambil data yang dikirim dari Frontend
    // HAPUS 'submitted_at' dari sini karena database akan mengisinya otomatis
    const { note_id, nama, nim, score, answers } = req.body;

    // 2. Validasi
    if (!note_id || !nama || !nim || !answers) {
      return res.status(400).json({ error: "Data tidak lengkap." });
    }

    // 3. Query SQL (Sesuaikan dengan kolom di HeidiSQL)
    const query = "INSERT INTO submissions (note_id, nama, nim, score, answers) VALUES (?, ?, ?, ?, ?)";

    // 4. Eksekusi
    await db.execute(query, [note_id, nama, nim, score, answers]);

    res.status(201).json({ message: "Jawaban berhasil dikirim!" });
  } catch (error) {
    console.error("Error saat submit:", error);
    res.status(500).json({ error: "Gagal mengirim jawaban ke server." });
  }
};

// Fungsi tambahan untuk Dosen melihat hasil (Nanti kita pakai)
exports.getSubmissionsByNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const [rows] = await db.execute("SELECT * FROM submissions WHERE note_id = ? ORDER BY submitted_at DESC", [noteId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data peserta." });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params; // ID Submission
    const { score } = req.body; // Nilai baru dari Dosen

    await db.execute("UPDATE submissions SET score = ? WHERE id = ?", [score, id]);

    res.json({ message: "Nilai berhasil diperbarui!" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menyimpan nilai." });
  }
};
