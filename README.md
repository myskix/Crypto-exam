CryptoExam - Secured Exam Platform

CryptoExam adalah platform ujian online yang dirancang dengan fokus pada keamanan integritas data menggunakan **Kriptografi Standar Militer (AES-256-GCM)**. Sistem ini memungkinkan Dosen untuk membuat soal terenkripsi, mengatur deadline, dan mengelola nilai mahasiswa dalam satu dashboard modern.

## ✨ Fitur Utama
* **Keamanan AES-256-GCM**: Soal ujian disimpan dalam bentuk terenkripsi di database.
* **Akses Terkontrol PIN**: Mahasiswa memerlukan PIN unik (yang di-hash dengan SHA-256) untuk membuka soal.
* **Sistem Deadline Otomatis**: Akses ujian ditutup secara otomatis jika melewati batas waktu yang ditentukan.
* **Dashboard Dosen (Dark Mode)**: Kelola ujian, salin link pengerjaan, dan hapus data secara instan.
* **Panel Koreksi Interaktif**: Dosen dapat membaca jawaban essay mahasiswa dan memberikan nilai akhir secara manual.
* **Responsive Landing Page**: Halaman depan yang modern untuk akses cepat bagi Dosen maupun Mahasiswa.

## 🛠️ Teknologi yang Digunakan
* **Frontend**: React.js, Tailwind CSS (Dark Theme), SweetAlert2.
* **Backend**: Node.js, Express.js.
* **Database**: MySQL (diatur melalui HeidiSQL/Laragon).
* **Kriptografi**: Library `crypto` (AES-256-GCM).

## 🚀 Cara Menjalankan Proyek

### 1. Persiapan Database
1.  Buka HeidiSQL atau Laragon.
2.  Buat database baru bernama `crypto_exam_db`.
3.  Impor tabel `notes`, `users`, dan `submissions` sesuai struktur yang telah dibuat.

### 2. Konfigurasi Backend
1.  Masuk ke folder backend: `cd backend`.
2.  Install dependencies: `npm install`.
3.  Buat file `.env` dan masukkan kredensial database Anda:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=
    DB_NAME=crypto_exam_db
    JWT_SECRET=rahasia_anda
    ```
4.  Jalankan server: `node server.js`.

### 3. Konfigurasi Frontend
1.  Masuk ke folder frontend: `cd frontend`.
2.  Install dependencies: `npm install`.
3.  Jalankan aplikasi: `npm run dev`.
4.  Buka link `http://localhost:5173` di browser Anda.

## 📁 Struktur Folder
```text
CRYPTO-EXAM-APP/
├── backend/
│   ├── config/          # Koneksi Database
│   ├── controllers/     # Logika Bisnis (Auth, Notes, Submissions)
│   ├── routes/          # API Endpoints
│   └── server.js        # Entry Point Backend
├── frontend/
│   ├── src/
│   │   ├── pages/       # LandingPage, Dashboard, SubmissionList, dll
│   │   └── App.jsx      # Routing Frontend
└── .gitignore           # File pengabaian Git (Node Modules, .env)
