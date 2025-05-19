const demandeService = require("../services/demandeService");

const createDemande = async (req, res) => {
  try {
    const { faculté, typeDocument } = req.body;
    const quittance = req.file.path;

    const nouvelleDemande = await demandeService.createDemande(
      req.user?._id || "6644fc6011a15a3b6e70ac45",
      faculté,
      typeDocument,
      quittance
    );

    await demandeService.envoyerEmailNotification(
      req.user?.email || "etudiant@example.com",
      "Demande reçue",
      "Votre demande a été reçue et est en cours de traitement."
    );

    res.status(201).json(nouvelleDemande);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const updateDemande = async (req, res) => {
  try {
    const { statut, message } = req.body;
    const demandeId = req.params.id;

    const demandeMiseAJour = await demandeService.updateDemande(
      statut,
      message,
      demandeId
    );

    await demandeService.envoyerEmailNotification(
      req.user?.email || "etudiant@example.com",
      "Mise à jour de votre demande",
      `Votre demande a été mise à jour avec le statut : ${statut}`
    );

    res.status(200).json(demandeMiseAJour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getAllDemandes = async (req, res) => {
  try {
    const demandes = await demandeService.getAllDemandes();
    res.status(200).json(demandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDemandeById = async (req, res) => {
  try {
    const demande = await demandeService.getDemandeById(req.params.id);
    if (!demande) return res.status(404).json({ error: "Demande non trouvée" });
    res.status(200).json(demande);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createDemande,
  updateDemande,
  getAllDemandes,
  getDemandeById,
};
