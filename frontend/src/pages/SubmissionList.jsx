import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import Alert Cantik

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
    fetch(`${API_URL}/notes/submissions${id}`, {
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
      const res = await fetch(`${API_URL}/notes/submission${selectedStudent.id}`, {
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
    <div className="min-h-screen bg-[#0f172a] p-8 relative overflow-hidden text-slate-300">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-\[500px] h-\[500px] bg-blue-600/5 blur-[120px] rounded-full -z-0`"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigasi */}
        <button onClick={() => navigate("/dashboard")} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-400 font-bold transition-all group">
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Dashboard
        </button>

        {/* HEADER: JUDUL UJIAN */}
        <div className="bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{examTitle}</h1>
            <p className="text-blue-500/60 font-mono text-xs mt-2 uppercase tracking-widest">ID: {id}</p>
          </div>
          <div className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-6 py-3 rounded-2xl font-bold text-sm">Total Peserta: {submissions.length}</div>
        </div>

        {/* TABEL PESERTA */}
        <div className="bg-[#1e293b]/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
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

      {/* === MODAL KOREKSI (POPUP DARK) === */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className=" rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700">
            {/* Header Modal */}
            <div className="p-8 bg-[#0f172a] border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-white">{selectedStudent.nama}</h2>
                <p className="text-blue-500 font-mono text-xs mt-1">{selectedStudent.nim}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 w-10 h-10 rounded-full flex items-center justify-center transition-all">
                ✕
              </button>
            </div>

            {/* Isi Jawaban (Scrollable) */}
            <div className="p-8 overflow-y-auto flex-1 ">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 border-b border-slate-800 pb-4 text-center">Lembar Jawaban Peserta</h3>
              <div className="space-y-2">{renderAnswers(selectedStudent.answers)}</div>
            </div>

            {/* Footer: Input Nilai */}
            <div className="p-8 bg-[#0f172a] border-t border-slate-800 flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-4">
                <label className="font-bold text-slate-300 text-sm uppercase tracking-wider">Nilai Akhir:</label>
                <input
                  type="number"
                  className="w-24 px-4 py-3 bg-[#1e293b] border border-slate-700 rounded-2xl text-center font-bold text-xl text-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  value={manualScore}
                  onChange={(e) => setManualScore(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <button
                onClick={handleSaveGrade}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Simpan Nilai ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
