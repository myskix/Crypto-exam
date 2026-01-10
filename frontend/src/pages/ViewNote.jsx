import Countdown from "../components/Countdown";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCryptography } from "../hooks/useCryptography";
import { getNoteById } from "../utils/api";

const ViewNote = () => {
  const { id } = useParams();
  const { decryptData } = useCryptography();
  const [data, setData] = useState(null);
  const [accessCode, setAccessCode] = useState("");
  const [decryptedSoal, setDecryptedSoal] = useState("");
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Ambil ciphertext dari backend berdasarkan ID di URL
    getNoteById(id)
      .then((res) => setData(res))
      .catch((err) => setError("Soal tidak ditemukan atau waktu habis."));
  }, [id]);

  const handleDecrypt = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Verifikasi Hash PIN (Sesuai Poin 9: Hashing)
      const encoder = new TextEncoder();
      const dataHash = encoder.encode(accessCode);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataHash);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedInput = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      // Bandingkan dengan hash dari database
      if (hashedInput !== data.access_code_hash) {
        setError("Kode PIN salah! (Hash tidak cocok)");
        return;
      }

      // 2. Jika Hash cocok, baru jalankan Dekripsi AES (Poin 29)
      const result = await decryptData(data.ciphertext, accessCode);
      setDecryptedSoal(result);
    } catch (err) {
      console.error(err);
      setError("Gagal mendekripsi. Data mungkin rusak atau PIN tidak sesuai.");
    }
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Waktu Habis!</h1>
          <p className="text-slate-600">Akses soal ujian telah ditutup secara otomatis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Akses Soal Ujian</h1>

        {!decryptedSoal ? (
          // TAMPILAN SEBELUM PIN DIMASUKKAN
          <form onSubmit={handleDecrypt} className="space-y-4">
            <p className="text-center text-slate-600">Masukkan kode akses untuk melihat soal.</p>
            <input type="password" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Kode PIN" required />
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all">Buka Soal</button>
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          </form>
        ) : (
          // TAMPILAN SETELAH BERHASIL DEKRIPSI
          <div className="animate-fade-in space-y-4">
            {/* Countdown */}
            <div className="flex justify-center mb-4">
              <Countdown deadline={data.deadline} onExpire={() => setIsExpired(true)} />
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-2">
              <p className="text-sm text-green-700 font-bold">Soal Berhasil Didekripsi:</p>
            </div>

            <div className="p-6 bg-slate-100 rounded-xl whitespace-pre-wrap font-serif text-lg text-slate-800 border border-slate-200 shadow-inner">{decryptedSoal}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNote;
