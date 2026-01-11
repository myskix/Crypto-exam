const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Kita buat ini di bawah

// Public Routes (Untuk Mahasiswa)
router.get("/:id", noteController.getNote);

// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Private Routes (Untuk Dosen - Perlu Token)
router.post("/", authMiddleware, noteController.createNote);
router.get("/my/all", authMiddleware, noteController.getMyNotes);

module.exports = router;
