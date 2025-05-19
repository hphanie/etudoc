const Demande = require("../models/demande");
const nodemailer = require("nodemailer");

exports.createDemande = async (etudiantId, faculté, typeDocument, quittance) => {
  const nouvelleDemande = new Demande({
    etudiant: etudiantId,
    faculté,
    typeDocument,
    quittance,
  });

  try {
    await nouvelleDemande.save();
    return nouvelleDemande;
  } catch (err) {
    throw new Error("Erreur lors de la création de la demande : " + err.message);
  }
};

exports.updateDemande = async (statut, message, demandeId) => {
  try {
    const demande = await Demande.findById(demandeId);
    if (!demande) throw new Error("Demande non trouvée");

    // Mise à jour de l'historique
    demande.historique.push({ statut, message });

    // Mise à jour du statut de la demande
    demande.statut = statut;
    await demande.save();
    
    return demande;
  } catch (err) {
    throw new Error("Erreur lors de la mise à jour de la demande : " + err.message);
  }
};

exports.envoyerEmailNotification = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tonemail@gmail.com",  // Remplacer par l'email de l'administration
      pass: "tonmotdepasse",       // Remplacer par le mot de passe
    },
  });

  const mailOptions = {
    from: "tonemail@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error("Erreur lors de l'envoi de l'email : " + err.message);
  }
};

module.exports = {
  createDemande,
  updateDemande,
  envoyerEmailNotification,
};
