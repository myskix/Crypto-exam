const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

router.post("/", noteController.createNote); // Dosen menyimpan soal
router.get("/:id", noteController.getNote); // Mahasiswa mengambil soal

module.exports = router;
