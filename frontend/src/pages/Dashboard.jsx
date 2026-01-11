import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [myNotes, setMyNotes] = useState([]);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // Ambil daftar soal dari backend
    fetch("http://localhost:5001/notes/my/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMyNotes(data))
      .catch((err) => console.error("Gagal ambil data:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Halo, Pak/Bu {user} 👋</h1>
            <p className="text-slate-500">Kelola semua soal ujian Anda di sini.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/create" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
              + Buat Soal Baru
            </Link>
            <button onClick={handleLogout} className="bg-white text-red-500 border border-red-100 px-5 py-2 rounded-xl font-bold hover:bg-red-50 shadow-sm">
              Logout
            </button>
          </div>
        </div>

        {/* TABEL SOAL */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4 text-sm">ID Soal</th>
                <th className="p-4 text-sm">Deadline</th>
                <th className="p-4 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myNotes.length > 0 ? (
                myNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-blue-600">{note.id}</td>
                    <td className="p-4 text-sm text-slate-600">{new Date(note.deadline).toLocaleString("id-ID")}</td>
                    <td className="p-4">
                      <Link to={`/view/${note.id}`} className="text-indigo-600 text-sm font-bold hover:underline">
                        Buka Link Soal
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-400">
                    Belum ada soal. Klik "+ Buat Soal Baru" untuk memulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
