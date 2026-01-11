import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5001/notes/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token); // Simpan kunci akses
      localStorage.setItem("user", data.username);
      navigate("/dashboard");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Login Dosen</h1>
        <p className="text-slate-500 mb-6 text-sm">Masuk untuk mengelola soal ujian Anda.</p>
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input type="password" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg">Masuk</button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 font-bold">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
