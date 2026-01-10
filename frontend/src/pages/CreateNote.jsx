import React, { useState } from "react";
import { useCryptography } from "../hooks/useCryptography";
import { saveNote } from "../utils/api";

const CreateNote = () => {
  const [note, setNote] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { encryptData } = useCryptography();

  // Fungsi untuk menyalin teks ke clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      // Kembalikan status tombol setelah 2 detik
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  const handleEncrypt = async (e) => {
    e.preventDefault();
    try {
      // 1. Proses Enkripsi di sisi Client
      const ciphertext = await encryptData(note, accessCode);

      // 2. Kirim data ke Backend (MySQL) melalui API
      const result = await saveNote({
        ciphertext,
        deadline,
        accessCode,
      });

      if (result.id) {
        // 3. Set link yang dihasilkan
        setLink(`${window.location.origin}/view/${result.id}`);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat enkripsi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Panel Dosen</h1>
        <p className="text-slate-500 mb-8">Buat soal ujian terenkripsi dengan batas waktu.</p>

        <form onSubmit={handleEncrypt} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Isi Soal Ujian</label>
            <textarea
              className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tuliskan pertanyaan ujian di sini..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kode Akses (PIN)</label>
              <input
                type="password"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="PIN untuk Dekripsi"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline Akses</label>
              <input type="datetime-local" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1">
            Enkripsi & Bagikan Soal
          </button>
        </form>

        {/* UI Output Link yang Minimalis */}
        {link && (
          <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in">
            <p className="text-slate-700 font-bold mb-3 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              Soal Berhasil Diamankan!
            </p>

            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
              <input readOnly value={link} className="flex-1 bg-transparent px-3 py-1 text-sm text-blue-600 font-mono outline-none" />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isCopied ? "bg-green-500 text-white shadow-green-100" : "bg-slate-800 text-white hover:bg-slate-900 shadow-slate-100"} shadow-md`}
              >
                {isCopied ? "Tersalin!" : "Salin Link"}
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-700 tracking-widest text-center">Bagikan link di atas beserta PIN kepada mahasiswa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNote;
