const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/api/routes/auth.route");
const demandeRoutes = require("./src/api/routes/demande.route"); 
const path = require('path');
const connectToDB = require("./src/api/config/database");
require("dotenv").config();

const app = express();

connectToDB();


app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'src', 'Uploads')));

// Route par défaut
app.get('/', (req, res) => {
  res.send('Bienvenue sur EtuDoc API');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).send('Route non trouvée');
});

// Démarrer le serveur
const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});