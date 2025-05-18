const express = require('express');
const router = express.Router();
const demandeControllers = require('../controllers/demandeControllers');
const upload = require('../uploads/upload'); // si tu gères les fichiers

router.post('/', upload.single('quittance'), demandeControllers.createDemande);
router.put('/:id', demandeControllers.updateDemande);
router.get('/', demandeControllers.getAllDemandes);
router.get('/:id', demandeControllers.getDemandeById);

module.exports = router;
