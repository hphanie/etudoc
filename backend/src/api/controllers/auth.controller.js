const authService = require("../services/auth.service");

const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const result = await authService.login({ email, motDePasse });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const register = async (req, res) => {
  console.log("Reçu depuis React :", req.body);  
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await authService.getMe(req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  res.status(200).json({ message: "update profile" });
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
};