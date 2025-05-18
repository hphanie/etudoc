const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  motDePasse: {
    type: String,
    required: true,
  },
  rôle: {
    type: String,
    enum: ["etudiant", "admin"],
    default: "etudiant",
  },
  dateInscription: {
    type: Date,
    default: Date.now,
  },
});

// Hash du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("motDePasse")) return next();
  try {
    const sel = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, sel);
    next();
  } catch (err) {
    next(err);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (motDePasseEntrant) {
  return await bcrypt.compare(motDePasseEntrant, this.motDePasse);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
