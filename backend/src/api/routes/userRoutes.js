const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

  const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
  if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token, role: user.role });
});

module.exports = router;
