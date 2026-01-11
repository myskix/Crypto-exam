import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5001/notes/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } else {
      const data = await res.json();
      alert(data.error || "Gagal mendaftar");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Daftar Akun Dosen</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Pilih Username" onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input type="password" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buat Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg">Daftar Sekarang</button>
        </form>
        <p className="mt-4 text-sm text-center text-slate-500">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
