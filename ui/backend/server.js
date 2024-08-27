const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Assurez-vous d'importer 'path'
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

dotenv.config();

const app = express();

// Configurez Express pour servir les fichiers statiques du dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

// Middleware
app.use(cors()); // Active CORS
app.use(express.json()); // Parse les requêtes JSON

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
