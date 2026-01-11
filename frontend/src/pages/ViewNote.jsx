import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCryptography } from "../hooks/useCryptography";
import { getNoteById } from "../utils/api";
import Countdown from "../components/Countdown";

const ViewNote = () => {
  const { id } = useParams();
  const { decryptData } = useCryptography();

  // --- STATE ---
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, active, expired, error, submitted
  const [msg, setMsg] = useState("");

  // Input Data Mahasiswa
  const [identity, setIdentity] = useState({ name: "", nim: "", pin: "" });

  // Jawaban Mahasiswa
  const [answers, setAnswers] = useState({}); // { 0: "Jawaban A", 1: "Jawaban Essay..." }

  // 1. Ambil Data Ujian
  useEffect(() => {
    getNoteById(id)
      .then((data) => {
        setExam(data);
        setStatus(new Date(data.deadline) < new Date() ? "expired" : "active");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  // 2. Buka Soal
  const handleUnlock = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!identity.name || !identity.nim || !identity.pin) return setMsg("Lengkapi Nama, NIM, dan PIN!");

    try {
      const decryptedString = await decryptData(exam.ciphertext, identity.pin, exam.access_code_hash);

      try {
        setQuestions(JSON.parse(decryptedString));
      } catch (jsonErr) {
        setQuestions([{ type: "essay", text: decryptedString }]);
      }
    } catch (err) {
      setMsg("PIN Salah atau Data Rusak!");
    }
  };

  // 3. Simpan Jawaban Sementara di State
  const handleAnswerChange = (idx, value) => {
    setAnswers({ ...answers, [idx]: value });
  };

  // 4. Submit Jawaban
  const handleSubmit = async () => {
    if (!window.confirm("Yakin ingin mengirim jawaban?")) return;

    let correctCount = 0;
    let choiceCount = 0;

    questions.forEach((q, idx) => {
      if (q.type === "choice") {
        choiceCount++;
        if (answers[idx] === q.key) correctCount++;
      }
    });

    const scorePG = choiceCount > 0 ? Math.round((correctCount / choiceCount) * 100) : 0;

    const payload = {
      note_id: id,
      nama: identity.name,
      nim: identity.nim,
      score: null,
      answers: JSON.stringify(answers),
    };

    try {
      const res = await fetch("http://localhost:5001/notes/submit", {
        // Perhatikan '/notes/submit'
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("submitted");
      } else {
        alert("Gagal mengirim jawaban ke server.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  // --- RENDER ---
  if (status === "loading") return <div className="text-center mt-20 text-slate-500">Memuat data...</div>;
  if (status === "error") return <div className="text-center mt-20 text-red-500 font-bold">404: Data tidak ditemukan.</div>;
  if (status === "expired") return <div className="text-center mt-20 text-red-500 text-2xl font-bold">⛔ Waktu Habis</div>;

  // Tampilan Sukses Submit
  if (status === "submitted")
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md border-t-4 border-green-500">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Jawaban Terkirim!</h1>
          <p className="text-slate-500">
            Terima kasih, <b>{identity.name}</b>. Jawaban Anda telah disimpan.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden h-fit">
        <div className="bg-slate-800 p-6 text-center text-white">
          <h1 className="font-bold text-xl">{exam.title || "Ujian Terenkripsi"}</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">ID: {id}</p>
        </div>

        <div className="p-8">
          {/* FASE 1: INPUT IDENTITAS & PIN */}
          {!questions ? (
            <div className="max-w-sm mx-auto space-y-6">
              <div className="text-center">
                <h2 className="font-bold text-slate-700 text-lg">Identitas Peserta</h2>
                <p className="text-slate-500 text-sm">Lengkapi data sebelum memulai.</p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama Lengkap" value={identity.name} onChange={(e) => setIdentity({ ...identity, name: e.target.value })} required />
                <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="NIM" value={identity.nim} onChange={(e) => setIdentity({ ...identity, nim: e.target.value })} required />

                <div className="pt-4 border-t">
                  <p className="text-xs text-center text-slate-400 mb-2">Masukkan Kode Akses dari Dosen</p>
                  <input
                    type="password"
                    className="w-full text-center text-xl font-bold p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none tracking-widest"
                    placeholder="PIN"
                    value={identity.pin}
                    onChange={(e) => setIdentity({ ...identity, pin: e.target.value })}
                    required
                  />
                </div>

                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-lg transition-transform hover:-translate-y-1">Mulai Ujian</button>
              </form>

              {msg && <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg text-center animate-pulse">{msg}</div>}
            </div>
          ) : (
            /* FASE 2: KERJAKAN SOAL */
            <div className="animate-fade-in space-y-8">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
                <div className="text-blue-900 text-sm">
                  <p className="font-bold">{identity.name}</p>
                  <p className="text-xs opacity-70">{identity.nim}</p>
                </div>
                <Countdown deadline={exam.deadline} onExpire={() => setStatus("expired")} />
              </div>

              <div className="space-y-10">
                {questions.map((q, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      <span className="-0 w-8 h-8 bg-slate-700 text-white rounded-md flex items-center justify-center font-bold text-sm shadow-sm">{idx + 1}</span>

                      <div className="flex-1 space-y-4">
                        <p className="text-lg text-slate-800 font-medium leading-relaxed">{q.text}</p>

                        {q.type === "choice" ? (
                          <div className="space-y-3">
                            {q.options.map((opt, i) => (
                              <label
                                key={i}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${answers[idx] === opt ? "bg-blue-50 border-blue-300 ring-1 ring-blue-300" : "hover:bg-slate-50 border-slate-200"}`}
                              >
                                <input type="radio" name={`q-${idx}`} value={opt} checked={answers[idx] === opt} onChange={() => handleAnswerChange(idx, opt)} className="w-4 h-4 text-blue-600 accent-blue-600" />
                                <span className="text-slate-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none h-32 transition-all"
                            placeholder="Tulis jawaban essay Anda di sini..."
                            value={answers[idx] || ""}
                            onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100">
                <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1">
                  Kirim Jawaban
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">Pastikan semua jawaban sudah terisi sebelum mengirim.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNote;
