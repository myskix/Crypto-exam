import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import Alert Cantik
import { API_URL } from "../utils/api";

const SubmissionList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [examTitle, setExamTitle] = useState("Memuat Judul..."); // State Judul
  const [selectedStudent, setSelectedStudent] = useState(null); // Data Modal
  const [manualScore, setManualScore] = useState(0); // Input Nilai

  // 1. Ambil Data Submissions & Judul Ujian
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch Submissions
    fetch(`${API_URL}/notes/submissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch((err) => console.error(err));

    // Fetch Detail Ujian (Untuk ambil Judul)
    fetch(`${API_URL}/notes/${id}`) // Kita pakai endpoint public getNote
      .then((res) => res.json())
      .then((data) => setExamTitle(data.title))
      .catch(() => setExamTitle("Ujian Tanpa Judul"));
  }, [id]);

  // 2. Buka Modal Koreksi
  const handleOpenCorrection = (student) => {
    setSelectedStudent(student);
    setManualScore(student.score); // Isi default dengan nilai PG (jika ada)
  };

  // 3. Simpan Nilai (Koreksi Selesai)
  const handleSaveGrade = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/notes/submission/${selectedStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: manualScore }),
      });

      if (res.ok) {
        // Update tabel lokal biar gak perlu refresh halaman
        const updatedSubs = submissions.map((sub) => (sub.id === selectedStudent.id ? { ...sub, score: manualScore } : sub));
        setSubmissions(updatedSubs);
        setSelectedStudent(null); // Tutup modal

        // ALERT CANTIK (SweetAlert2)
        Swal.fire({
          icon: "success",
          title: "Nilai Disimpan!",
          text: `Nilai untuk ${selectedStudent.nama} berhasil diperbarui.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Gagal menyimpan nilai", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
    }
  };

  // Helper: Render Jawaban JSON
  const renderAnswers = (data) => {
    try {
      // Cek: Jika data sudah berupa object, pakai langsung. Jika string, baru di-parse.
      const answers = typeof data === "string" ? JSON.parse(data) : data;

      return Object.entries(answers).map(([idx, val]) => (
        <div key={idx} className="mb-4 border border-slate-200 rounded-lg p-3 bg-slate-50">
          <span className="font-bold text-blue-600 text-xs uppercase tracking-wide">Soal No {parseInt(idx) + 1}</span>
          <p className="text-slate-800 mt-1 whitespace-pre-wrap font-medium">{val}</p>
        </div>
      ));
    } catch (e) {
      console.error("Format jawaban salah:", e);
      return <p className="text-red-500 italic">Gagal memuat format jawaban.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 relative overflow-hidden text-slate-300">
      {/* Background Glow - Adjusted for mobile */}
      <div className="absolute top-0 left-1/4 w-/[300px] md:w-/[500px] h-/[300px] md:h-/[500px] bg-blue-600/5 blur-[80px] md:blur-[120px] rounded-full -z-0`"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigasi */}
        <button onClick={() => navigate("/dashboard")} className="mb-6 md:mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-400 font-bold transition-all group text-sm md:text-base">
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Dashboard
        </button>

        {/* HEADER: JUDUL UJIAN */}
        <div className="bg-[#1e293b]/50 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-slate-800 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">{examTitle}</h1>
            <p className="text-blue-500/60 font-mono text-[10px] md:text-xs mt-2 uppercase tracking-widest">ID: {id}</p>
          </div>
          <div className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm w-full md:w-auto text-center">Total Peserta: {submissions.length}</div>
        </div>

        {/* === TAMPILAN MOBILE (CARD VIEW) === */}
        <div className="md:hidden space-y-4">
          {submissions.length > 0 ? (
            submissions.map((sub) => (
              <div key={sub.id} onClick={() => handleOpenCorrection(sub)} className="bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-800 shadow-lg active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-bold text-lg">{sub.nama}</h3>
                    <p className="text-slate-500 font-mono text-sm">{sub.nim}</p>
                  </div>
                  {sub.score !== null ? (
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${sub.score >= 60 ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{sub.score}</span>
                  ) : (
                    <span className="bg-slate-800 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-700">-</span>
                  )}
                </div>

                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-800/50">
                  <div className="text-xs text-slate-500">Submit: {new Date(sub.submitted_at).toLocaleDateString("id-ID")}</div>
                  <div className="text-blue-400 text-xs font-bold flex items-center gap-1">Koreksi Sekarang →</div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#1e293b]/50 p-10 rounded-2xl text-center border border-slate-800">
              <p className="text-slate-500 italic">Belum ada peserta.</p>
            </div>
          )}
        </div>

        {/* === TAMPILAN DESKTOP (TABLE VIEW) === */}
        <div className="hidden md:block bg-[#1e293b]/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left">
            <thead className="bg-[#0f172a]/50 text-slate-500 uppercase text-xs tracking-widest font-bold">
              <tr>
                <th className="p-6">Nama Mahasiswa</th>
                <th className="p-6">NIM</th>
                <th className="p-6 text-center">Status Koreksi</th>
                <th className="p-6 text-right">Waktu Submit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {submissions.map((sub) => (
                <tr key={sub.id} onClick={() => handleOpenCorrection(sub)} className="hover:bg-blue-600/5 cursor-pointer transition-colors group">
                  <td className="p-6">
                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{sub.nama}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter italic">Klik untuk koreksi</div>
                  </td>
                  <td className="p-6 text-slate-400 font-mono text-sm">{sub.nim}</td>

                  <td className="p-6 text-center">
                    {sub.score !== null ? (
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border ${sub.score >= 60 ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>Nilai: {sub.score}</span>
                    ) : (
                      <span className="bg-slate-800 text-slate-500 px-4 py-1.5 rounded-xl text-xs font-bold border border-slate-700">Belum Dinilai</span>
                    )}
                  </td>

                  <td className="p-6 text-right text-sm text-slate-500">{new Date(sub.submitted_at).toLocaleString("id-ID")}</td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-600 italic">
                    Belum ada peserta yang mengumpulkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === MODAL KOREKSI (RESPONSIVE) === */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700">
            {/* Header Modal */}
            <div className="p-6 md:p-8 bg-[#0f172a] border-b border-slate-800 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white truncate max-w-/[200px] md:max-w-md">{selectedStudent.nama}</h2>
                <p className="text-blue-500 font-mono text-xs mt-1">{selectedStudent.nim}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all shrink-0">
                ✕
              </button>
            </div>

            {/* Isi Jawaban (Scrollable) */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-[#1e293b]/20">
              <h3 className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 border-b border-slate-800 pb-4 text-center">Lembar Jawaban</h3>
              <div className="space-y-2">{renderAnswers(selectedStudent.answers)}</div>
            </div>

            {/* Footer: Input Nilai */}
            <div className="p-6 md:p-8 bg-[#0f172a] border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-between shrink-0">
              <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                <label className="font-bold text-slate-300 text-sm uppercase tracking-wider">Nilai:</label>
                <input
                  type="number"
                  className="w-24 px-4 py-3 bg-[#1e293b] border border-slate-700 rounded-xl text-center font-bold text-xl text-blue-400 focus:border-blue-500 outline-none transition-all"
                  value={manualScore}
                  onChange={(e) => setManualScore(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <button onClick={handleSaveGrade} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95">
                Simpan Nilai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
