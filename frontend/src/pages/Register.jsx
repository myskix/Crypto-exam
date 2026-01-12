import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URL } from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/notes/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        navigate("/login");
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Berhasil Daftar",
          showConfirmButton: false,
          timer: 2000,
          background: "#1e293b",
          color: "#fff",
        });
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Akun Telah Terdaftar",
          showConfirmButton: false,
          timer: 2000,
          background: "#1e293b",
          color: "#fff",
        });
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Gagal Koneksi Ke Server",
        showConfirmButton: false,
        timer: 2000,
        background: "#1e293b",
        color: "#fff",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-\[400px] h-\[400px] bg-cyan-600/10 blur-[100px] rounded-full -z-0`"></div>

      <div className="bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-800 z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-cyan-600/10 rounded-2xl mb-4 border border-cyan-500/20">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Daftar Dosen</h1>
          <p className="text-slate-400 text-sm mt-2">Buat akun pengelola baru.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest ml-1">Username</label>
            <input
              className="w-full px-5 py-3.5 rounded-xl bg-[#0f172a] border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white"
              placeholder="Username baru"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest ml-1">Password</label>
            <input
              type="password"
              className="w-full px-5 py-3.5 rounded-xl bg-[#0f172a] border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1">Buat Akun</button>
        </form>

        <p className="mt-10 text-sm text-center text-slate-500">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
