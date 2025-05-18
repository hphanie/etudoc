const mongoose = require("mongoose");

const demandeSchema = new mongoose.Schema({
  etudiant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  faculté: {
    type: String,
    required: true,
  },
  typeDocument: {
    type: String,
    enum: ["CUE", "Attestation"],
    required: true,
  },
  quittance: {
    type: String, // URI du fichier téléchargé
    required: true,
  },
  statut: {
    type: String,
    enum: ["En cours", "Terminé", "Refusé"],
    default: "En cours",
  },
  historique: [
    {
      date: { type: Date, default: Date.now },
      statut: { type: String },
      message: { type: String },
    },
  ],
});

const Demande = mongoose.model("Demande", demandeSchema);
module.exports = Demande;
