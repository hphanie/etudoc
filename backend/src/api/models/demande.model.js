const mongoose = require('mongoose');

const demandeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nom: { type: String, required: true },
  type: { type: String, required: true, enum: ['Relevé de notes', 'Attestation de réussite'] },
  faculte: { type: String, required: true },
  fichiers: [{ type: String }],
  semestre: { type: String, default: '' },
  anneeAcademique: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  filiere: { type: String, default: '' },
  statut: { type: String, default: 'En attente', 
  enum: ['En attente', 'Validée', 'Rejetée'] },
  resultatFilePath: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Demande', demandeSchema);