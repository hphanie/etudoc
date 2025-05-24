const express = require('express');
const router = express.Router();
const { createDemande, getDemandes, updateDemande, getUserDemandes } = require('../controllers/demande.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'Uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  },
}).fields([
  { name: 'ficheDemande', maxCount: 1 },
  { name: 'carteEtudiant', maxCount: 1 },
  { name: 'cip', maxCount: 1 },
  { name: 'fichePreinscription', maxCount: 1 },
  { name: 'quittanceOriginale', maxCount: 1 },
  { name: 'quittanceCopie', maxCount: 1 },
]);

const uploadResultFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', '..', 'Uploads', 'Resultats');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés'));
    }
  },
}).single('resultatFile');

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log('Erreur Multer:', err, 'Champs reçus:', req.body, 'Fichiers:', req.files);
    return res.status(400).json({ message: `Erreur: ${err.message}`, field: err.field });
  } else if (err) {
    console.log('Erreur:', err, 'Champs reçus:', req.body, 'Fichiers:', req.files);
    return res.status(400).json({ message: err.message });
  }
  next();
};

router.post('/', requireAuth, upload, handleMulterError, createDemande);
router.get('/', requireAuth, getDemandes);
router.put('/:id', requireAuth, uploadResultFile, handleMulterError, updateDemande);
router.get('/user', requireAuth, getUserDemandes);

module.exports = router;