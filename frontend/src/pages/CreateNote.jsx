import React, { useState } from "react";
import { useCryptography } from "../hooks/useCryptography";
import { useNavigate } from "react-router-dom";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [deadline, setDeadline] = useState("");
  // Struktur soal sekarang punya properti 'key' untuk kunci jawaban
  const [questions, setQuestions] = useState([{ type: "essay", text: "", options: [], key: "" }]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const { encryptData } = useCryptography();

  // --- LOGIC FORM SOAL ---
  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      {
        type,
        text: "",
        options: type === "choice" ? ["", ""] : [],
        key: "", // Default kunci jawaban kosong
      },
    ]);
  };

  const removeQuestion = (idx) => {
    const newQ = [...questions];
    newQ.splice(idx, 1);
    setQuestions(newQ);
  };

  const updateQuestion = (idx, field, value) => {
    const newQ = [...questions];
    newQ[idx][field] = value;
    setQuestions(newQ);
  };

  const updateOption = (qIdx, oIdx, value) => {
    const newQ = [...questions];
    newQ[qIdx].options[oIdx] = value;
    // Jika opsi ini adalah kunci jawaban, update juga kuncinya
    if (questions[qIdx].key === questions[qIdx].options[oIdx]) {
      newQ[qIdx].key = value;
    }
    setQuestions(newQ);
  };

  const addOption = (qIdx) => {
    const newQ = [...questions];
    newQ[qIdx].options.push("");
    setQuestions(newQ);
  };

  // Set Kunci Jawaban (Radio Button)
  const setAnswerKey = (qIdx, optionValue) => {
    const newQ = [...questions];
    newQ[qIdx].key = optionValue;
    setQuestions(newQ);
  };

  // --- LOGIC SIMPAN ---
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Sesi habis. Silakan login ulang.");
      if (!title || !accessCode || !deadline) return alert("Data belum lengkap!");

      // Validasi: Pastikan Pilihan Ganda punya kunci jawaban
      const incompleteChoice = questions.find((q) => q.type === "choice" && !q.key);
      if (incompleteChoice) return alert("Ada soal Pilihan Ganda yang belum memiliki Kunci Jawaban!");

      const contentString = JSON.stringify(questions);
      const ciphertext = await encryptData(contentString, accessCode);

      const res = await fetch("http://localhost:5001/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, ciphertext, deadline, accessCode }),
      });

      const data = await res.json();
      if (data.id) {
        setGeneratedLink(`${window.location.origin}/view/${data.id}`);
        alert("Soal berhasil dibuat!");
      } else {
        alert("Gagal: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 flex justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-\[500px] h-\[500px] bg-blue-600/5 blur-[120px] rounded-full -z-0`"></div>

      <div className="w-full max-w-4xl bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-800 p-10 relative z-10">
        {/* Tombol Back */}
        <button onClick={() => navigate("/dashboard")} className="absolute top-10 left-10 text-slate-500 hover:text-white font-bold text-sm flex items-center gap-2 transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali
        </button>

        <h1 className="text-3xl font-extrabold text-white mb-8 mt-12 tracking-tight">Buat Ujian Baru</h1>

        {/* Metadata Ujian (Header) */}
        <div className="grid gap-6 mb-10 bg-[#0f172a]/50 p-8 rounded-3xl border border-slate-800 shadow-inner">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Nama Ujian</label>
            <input
              className="w-full bg-[#1e293b] p-4 border border-slate-700 rounded-2xl font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
              placeholder="Contoh: Ujian Tengah Semester Kriptografi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">PIN Akses (Password Soal)</label>
              <input
                type="password"
                className="w-full bg-[#1e293b] p-4 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                placeholder="Buat PIN Rahasia"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Batas Waktu (Deadline)</label>
              <input
                type="datetime-local"
                className="w-full bg-[#1e293b] p-4 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all \[color-scheme:dark]"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List Pertanyaan */}
        <div className="space-y-8 mb-10">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-[#0f172a]/30 border border-slate-800 p-6 rounded-2xl relative group hover:border-slate-700 transition-all shadow-sm">
              <button onClick={() => removeQuestion(idx)} className="absolute top-6 right-6 text-red-400 hover:text-red-300 font-bold text-[10px] uppercase tracking-wider bg-red-500/10 px-3 py-1.5 rounded-full transition-colors">
                Hapus
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-lg font-bold text-xs shadow-lg shadow-blue-900/20">{idx + 1}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Soal {q.type === "choice" ? "Pilihan Ganda" : "Essay"}</span>
              </div>

              <textarea
                className="w-full bg-[#1e293b] p-4 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all placeholder-slate-600 min-h-\[100px]"
                placeholder="Tulis pertanyaan Anda di sini..."
                value={q.text}
                onChange={(e) => updateQuestion(idx, "text", e.target.value)}
              />

              {q.type === "choice" && (
                <div className="mt-6 space-y-3 bg-[#0f172a]/50 p-6 rounded-2xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 mb-3 font-bold uppercase tracking-widest italic">Pilih Radio untuk Kunci Jawaban:</p>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-3 group/opt">
                      <input type="radio" name={`key-${idx}`} checked={q.key === opt && opt !== ""} onChange={() => setAnswerKey(idx, opt)} className="w-5 h-5 cursor-pointer accent-blue-500" />
                      <input
                        className={`flex-1 bg-transparent py-2 border-b border-slate-800 focus:border-blue-500 outline-none text-sm transition-all ${q.key === opt && opt !== "" ? "text-blue-400 font-bold" : "text-slate-400"}`}
                        placeholder={`Opsi ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                      />
                    </div>
                  ))}
                  <button onClick={() => addOption(idx)} className="text-xs text-blue-500 font-bold mt-4 hover:text-blue-400 flex items-center gap-1 transition-colors">
                    <span>+</span> Tambah Opsi
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons: Add Question */}
        <div className="flex gap-4 mb-10 pb-10 border-b border-slate-800">
          <button onClick={() => addQuestion("essay")} className="flex-1 px-6 py-4 bg-slate-800 text-slate-300 rounded-2xl hover:bg-slate-700 transition-all font-bold text-sm border border-slate-700">
            + Tambah Essay
          </button>
          <button onClick={() => addQuestion("choice")} className="flex-1 px-6 py-4 bg-slate-800 text-slate-300 rounded-2xl hover:bg-slate-700 transition-all font-bold text-sm border border-slate-700">
            + Tambah Pilihan Ganda
          </button>
        </div>

        {/* Final Action */}
        <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-900/20 transition-all transform hover:-translate-y-1 active:scale-95">
          Enkripsi & Terbitkan Ujian
        </button>

        {/* Link Output */}
        {generatedLink && (
          <div className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-3xl flex items-center gap-4 animate-fade-in">
            <div className="bg-green-500/20 p-2 rounded-lg text-green-400">🔗</div>
            <input readOnly value={generatedLink} className="flex-1 bg-transparent text-green-400 text-sm font-mono outline-none" />
            <button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-green-900/20">
              {isCopied ? "Berhasil!" : "Salin Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNote;
