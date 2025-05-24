const { createDemande: createDemandeService, getDemandes, updateDemande } = require('../services/demande.service');
const Demande = require('../models/demande.model'); // Importer le modèle Demande
const nodemailer = require('nodemailer');
const path = require('path');

const createDemande = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'Au moins un fichier est requis' });
    }

    const { nom, type, faculte, semestre, anneeAcademique, email, phone, filiere } = req.body;

    const fichiers = [];
    const expectedFields = [
      'ficheDemande',
      'carteEtudiant',
      'cip',
      'fichePreinscription',
      'quittanceOriginale',
      'quittanceCopie',
    ];

    expectedFields.forEach(field => {
      if (req.files[field]) {
        fichiers.push(req.files[field][0].path);
      }
    });

    if (fichiers.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier valide n\'a été téléchargé' });
    }

    const demande = await createDemandeService({
      userId: req.user.userId,
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

    res.status(201).json({ message: 'Demande créée avec succès', demande });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserDemandes = async (req, res) => {
  try {
    const demandes = await Demande.find({ userId: req.user.userId });
    console.log('Demandes récupérées pour userId:', req.user.userId, demandes);
    res.json(demandes);
  } catch (error) {
    console.error('Erreur dans getUserDemandes:', error);
    res.status(400).json({ message: error.message });
  }
};

const getDemandesController = async (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Accès non autorisé');
    const demandes = await getDemandes('FASEG');
    res.json(demandes);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const updateDemandeController = async (req, res) => {
  try {
    if (req.user.role !== 'admin') throw new Error('Accès non autorisé');
    const { id } = req.params;
    const { statut } = req.body;

    console.log('Mise à jour demande:', { id, statut, file: req.file });

    let resultatFilePath = null;
    if (req.file) {
      resultatFilePath = req.file.path;
    }

    const demande = await updateDemande(id, statut, resultatFilePath);

    console.log('Demande mise à jour:', demande);

    if (statut === 'validée' && demande.email) {
      await sendValidationEmail(demande.email, demande.nom, demande.type, resultatFilePath);
    } else if (statut === 'validée' && !demande.email) {
      console.log('Aucun email fourni pour la notification');
    }

    res.json({ message: 'Statut mis à jour', demande });
  } catch (error) {
    console.error('Erreur dans updateDemandeController:', error);
    res.status(400).json({ message: error.message });
  }
};

const sendValidationEmail = async (email, nom, type, resultatFilePath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Votre ${type} a été validé`,
    html: `
      <p>Bonjour ${nom},</p>
      <p>Votre demande de ${type} a été validée.</p>
      <p>Vous pouvez télécharger le document depuis votre tableau de bord : 
         <a href="http://localhost:3000/UserDashboard">Accéder au tableau de bord</a>
      </p>
      <p>Merci,</p>
      <p>L'équipe administrative</p>
    `,
    attachments: resultatFilePath
      ? [
          {
            filename: path.basename(resultatFilePath),
            path: resultatFilePath,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé à:', email);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

module.exports = {
  createDemande,
  getDemandes: getDemandesController,
  updateDemande: updateDemandeController,
  getUserDemandes, // Ajouter getUserDemandes à l'exportation
};