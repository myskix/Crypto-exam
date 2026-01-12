import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Akses ditolak. Silakan login." });
    }

    // Gunakan process.env agar lebih aman di Railway
    const verified = jwt.verify(token, process.env.JWT_SECRET || "RAHASIA_NEGARA");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token tidak valid." });
  }
};
