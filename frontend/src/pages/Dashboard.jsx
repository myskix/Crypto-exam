import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../utils/api";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  // Fungsi Fetch Data
  const fetchNotes = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch(`${API_URL}/notes/my/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotes(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNotes();
  }, [navigate]);

  // FUNGSI DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus ujian ini? Semua data jawaban mahasiswa juga akan terhapus!")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchNotes(); // Refresh tabel
      } else {
        alert("Gagal menghapus.");
      }
    } catch (err) {
      alert("Error koneksi.");
    }
  };

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(link);

    // Notifikasi Cantik
    Swal.fire({
      icon: "success",
      title: "Link Tersalin!",
      text: "Siap dibagikan ke mahasiswa.",
      timer: 1500,
      showConfirmButton: false,
      position: "top-end", // Muncul di pojok kanan atas
      toast: true, // Mode Toast (kecil & tidak memblokir layar)
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 relative overflow-hidden">
      {/* Efek Cahaya Latar (Glow) */}
      <div className="absolute top-0 right-0 w-\[500px] h-\[500px] bg-blue-600/5 blur-[120px] rounded-full -z-0`"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Halo, <span className="text-blue-400">{user}</span> 👋
            </h1>
            <p className="text-slate-400 mt-1">Kelola ujian dan pantau hasil mahasiswa Anda.</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Link to="/create" className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1 text-center">
              + Buat Ujian Baru
            </Link>
            <button onClick={handleLogout} className="bg-slate-800 hover:bg-red-500/10 text-red-400 border border-slate-700 px-6 py-3 rounded-2xl font-bold transition-all hover:border-red-500/50">
              Logout
            </button>
          </div>
        </div>

        {/* TABEL DATA (Dark Glassmorphism) */}
        <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-\[2rem] shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0f172a]/50 text-slate-400 uppercase text-xs tracking-widest font-bold">
              <tr>
                <th className="p-6">Judul Ujian</th>
                <th className="p-6">Deadline</th>
                <th className="p-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-700/40 transition-colors group">
                    {/* Info Ujian */}
                    <td className="p-6 cursor-pointer" onClick={() => navigate(`/results/${note.id}`)}>
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors text-lg mb-1">{note.title}</div>
                      <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-500">ID: {note.id.substring(0, 8)}...</span>
                        <span className="text-[10px] text-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity italic">Klik untuk hasil</span>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="p-6 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">📅</span>
                        {new Date(note.deadline).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Tombol Aksi */}
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleCopyLink(note.id)}
                          className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                          title="Salin Link Ujian"
                        >
                          🔗 Salin Link
                        </button>

                        <button
                          onClick={() => handleDelete(note.id)}
                          className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl text-sm font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Hapus Ujian"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-20 text-center">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-slate-500 font-medium italic">Belum ada ujian yang dibuat.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Footer Dashboard */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-xs tracking-widest uppercase">Sistem Keamanan Terenkripsi AES-256 Aktif</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
