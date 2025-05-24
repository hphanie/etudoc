const express = require("express");
const router = express.Router();
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile
} = require("../controllers/auth.controller");
const { loginSchema, registerSchema } = require("../validations/auth.validation");
const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth.middleware");

router.post('/register', register);
router.post('/login', login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);
router.get("/me", requireAuth, getMe);
router.put("/update-me", requireAuth, updateProfile);

module.exports = router;
