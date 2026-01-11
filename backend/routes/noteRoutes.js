const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

// Import Controller & Middleware
const noteController = require("../controllers/noteController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// === RUTE PUBLIC (Siapapun bisa akses) ===
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/:id", noteController.getNote); // Mahasiswa buka soal
router.post("/submit", submissionController.submitExam);

// === RUTE PRIVATE (Hanya Dosen Login) ===
// Perhatikan: ada authMiddleware diselipkan di tengah
router.get("/submissions/:noteId", authMiddleware, submissionController.getSubmissionsByNote);
router.put("/submission/:id", authMiddleware, submissionController.gradeSubmission);
router.post("/", authMiddleware, noteController.createNote);
router.get("/my/all", authMiddleware, noteController.getMyNotes);
router.delete("/:id", authMiddleware, noteController.deleteNote);

module.exports = router;
