import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [examId, setExamId] = useState("");

  const handleJoinExam = (e) => {
    e.preventDefault();
    if (examId.trim()) {
      navigate(`/view/${examId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300">
      {/* === NAVBAR === */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-white">CryptoExam</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="text-slate-400 hover:text-white font-bold text-sm transition-colors py-2">
              Masuk
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
              Daftar Dosen
            </Link>
          </div>
        </div>
      </nav>

      {/* === HERO SECTION === */}
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative">
        {/* Efek Cahaya Latar (Glow) */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-\[500px] h-[300px]\ bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>

        <div className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold mb-8 border border-blue-500/20">🔒 Secured with AES-256-GCM Encryption</div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1]">
          Ujian Online Aman <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">Terenkripsi</span>
        </h1>

        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">Platform pengerjaan soal ujian yang menjamin integritas data. Didesain untuk kerahasiaan soal dan kemudahan monitoring bagi dosen.</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-600/20 transition-all transform hover:-translate-y-1">
            Mulai Buat Ujian
          </Link>
          <a href="#student-access" className="bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 px-10 py-4 rounded-2xl font-bold text-lg transition-all">
            Akses Mahasiswa
          </a>
        </div>
      </header>

      {/* === STUDENT QUICK ACCESS (DARK) === */}
      <section id="student-access" className="bg-[#0f172a]/50 border-y border-slate-800 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Input ID Ujian</h2>
          <p className="text-slate-400 mb-10 text-lg">Masukkan kode unik soal untuk memulai pengerjaan.</p>

          <form onSubmit={handleJoinExam} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Contoh: 5dd3630d..."
              className="flex-1 px-6 py-4 bg-[#0f172a] border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-mono placeholder-slate-600"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              required
            />
            <button className="bg-white hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl">Buka Soal →</button>
          </form>
        </div>
      </section>

      {/* === FEATURES GRID (DARK) === */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#1e293b]/40 p-10 rounded-\[2rem]\ border border-slate-800 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🔑</div>
            <h3 className="text-xl font-bold text-white mb-4">AES-256 Encryption</h3>
            <p className="text-slate-400 leading-relaxed">Soal ujian diamankan dengan enkripsi simetris. Kerahasiaan data terjamin di database.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#1e293b]/40 p-10 rounded-\[2rem]\ border border-slate-800 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-xl font-bold text-white mb-4">Monitoring Hasil</h3>
            <p className="text-slate-400 leading-relaxed">Pantau jawaban mahasiswa secara real-time dan berikan penilaian manual dengan mudah.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#1e293b]/40 p-10 rounded-\[2rem]\ border border-slate-800 hover:border-blue-500/50 transition-all group">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">📅</div>
            <h3 className="text-xl font-bold text-white mb-4">Deadline Kontrol</h3>
            <p className="text-slate-400 leading-relaxed">Atur batas waktu pengerjaan ujian secara presisi. Sistem akan mengunci otomatis saat waktu habis.</p>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#0f172a] border-t border-slate-800 py-16 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="font-bold text-lg text-white">CryptoExam</span>
          </div>
          <p className="text-slate-500 mb-2">&copy; {new Date().getFullYear()} Protected System. All rights reserved.</p>
          <p className="text-slate-600">{/* Dikembangkan oleh <span className="text-blue-400 font-bold">Miski</span> */}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
