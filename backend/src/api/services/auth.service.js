const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const register = async ({ fullname, email, motDePasse }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Cet email est déjà utilisé.");
  }

  const hashedPassword = await bcrypt.hash(motDePasse, 10);

  const newUser = new User({
    fullname,
    email,
    motDePasse: hashedPassword,
  });

  await newUser.save();

  return { message: "Inscription réussie !" };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  const isMatch = await bcrypt.compare(password, user.motDePasse);
  if (!isMatch) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    message: "Connexion réussie",
    token,
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
  };
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Aucun utilisateur trouvé avec cet email.");

  const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  await transporter.sendMail({
    to: user.email,
    subject: "Réinitialisation du mot de passe",
    html: `<p>Pour réinitialiser votre mot de passe, cliquez ici : <a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  return { message: "Email de réinitialisation envoyé avec succès." };
};

const resetPassword = async ({ token, newPassword }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error("Utilisateur introuvable.");

    user.motDePasse = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Mot de passe réinitialisé avec succès." };
  } catch (error) {
    throw new Error("Token invalide ou expiré.");
  }
};

const getMe = async (user) => {
  const existingUser = await User.findById(user.userId).select("-motDePasse");
  if (!existingUser) throw new Error("Utilisateur non trouvé.");

  return existingUser;
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
};
