const Demande = require('../models/demande.model');

const createDemande = async ({ userId, nom, type, faculte, fichiers, semestre, anneeAcademique, email, phone, filiere }) => {
  if (!fichiers || !fichiers.length) throw new Error('Au moins un fichier est requis');

  const demande = new Demande({
    userId,
    nom,
    type,
    faculte,
    fichiers,
    semestre,
    anneeAcademique,
    email,
    phone,
    filiere,
  });

  await demande.save();
  return demande;
};

const getDemandes = async (faculte) => {
  return await Demande.find({ faculte });
};

const updateDemande = async (id, statut, resultatFilePath) => {
  const updateData = { statut };
  if (resultatFilePath) {
    updateData.resultatFilePath = resultatFilePath;
  }

  const demande = await Demande.findByIdAndUpdate(id, updateData, { new: true });
  if (!demande) {
    throw new Error('Demande non trouvée');
  }
  return demande;
};

module.exports = { createDemande, getDemandes, updateDemande };