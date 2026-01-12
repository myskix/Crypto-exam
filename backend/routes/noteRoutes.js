import express from "express";
const router = express.Router();

import * as submissionController from "../controllers/submissionController.js";
import * as noteController from "../controllers/noteController.js";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

// RUTE PUBLIC
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/:id", noteController.getNote);
router.post("/submit", submissionController.submitExam);

// RUTE PRIVATE
router.get("/submissions/:noteId", authMiddleware, submissionController.getSubmissionsByNote);
router.put("/submission/:id", authMiddleware, submissionController.gradeSubmission);
router.post("/", authMiddleware, noteController.createNote);
router.get("/my/all", authMiddleware, noteController.getMyNotes);
router.delete("/:id", authMiddleware, noteController.deleteNote);

export default router;
