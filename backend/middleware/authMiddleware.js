const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Ambil token dari header "Authorization: Bearer <token>"
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Akses ditolak. Silakan login." });
    }

    // Cek keaslian token
    const verified = jwt.verify(token, "RAHASIA_NEGARA"); // Pastikan secret key sama dengan saat login
    req.user = verified; // Simpan data user ke request
    next(); // Lanjut ke controller berikutnya
  } catch (err) {
    res.status(400).json({ error: "Token tidak valid." });
  }
};
