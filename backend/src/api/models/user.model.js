const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      unique: true, 
      required: true, 
      lowercase: true,
      match: [/.+\@.+\..+/, 'Veuillez saisir un email valide']
    },
    motDePasse: { type: String, required: true },
    role: { type: String, enum: ["etudiant", "admin"], default: "etudiant" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
