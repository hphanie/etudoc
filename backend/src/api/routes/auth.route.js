const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { login, register, getMe, updateProfile, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { loginSchema, registerSchema, forgetPassword, resetPassword: resetPasswordSchema } = require("../validations/auth.validation");
const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/authMiddleware");

// Multer (non utilisé ici pour register car pas besoin)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgetPassword), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", requireAuth, getMe);
router.put("/update-me", requireAuth, updateProfile);

module.exports = router;
