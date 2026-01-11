const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Akses ditolak, silakan login." });

  try {
    const verified = jwt.verify(token, "RAHASIA_NEGARA");
    req.user = verified; // Menyimpan ID dosen ke dalam request
    next();
  } catch (err) {
    res.status(400).json({ error: "Token tidak valid." });
  }
};
