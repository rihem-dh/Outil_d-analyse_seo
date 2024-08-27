const express = require('express');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const PDFHistory = require('../models/pdfHistory');
const upload = require('../multerConfig');
const router = express.Router();

const CLIENT_ID = '710711825254-fsi0tt86cb6ehk3d4f0ce7s9pbj3hvv7.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// Route pour l'inscription
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error); // Pour déboguer les erreurs
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Connexion réussie
    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error); // Pour déboguer les erreurs
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Route pour la connexion avec Google
router.post('/google-login', async (req, res) => {
    const { id_token } = req.body;
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload.email;
  
      // Vérifiez si l'utilisateur existe dans votre base de données
      let user = await User.findOne({ email });
      if (!user) {
        // Si l'utilisateur n'existe pas, créez-le
        user = new User({ email });
        await user.save();
      }
  
      // Renvoie la réponse avec les données de l'utilisateur
      res.status(200).json({ success: true, user: { email: user.email } });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  });


  // Route pour changer le mot de passe
router.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Ancien mot de passe incorrect.' });
    }

    // Mettre à jour le mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ success: true, message: 'Mot de passe changé avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Une erreur est survenue.' });
  }
});


// Route pour sauvegarder un PDF dans l'historique
router.post('/save-pdf', async (req, res) => {
  const { userEmail, pdfName, date } = req.body;

  if (!userEmail || !pdfName || !date) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const newPDFEntry = new PDFHistory({
      userEmail,
      pdfName,
      date,
    });

    await newPDFEntry.save();
    res.status(200).json({ message: 'PDF sauvegardé dans l\'historique.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde du PDF.' });
  }
});



// Route pour télécharger un fichier
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier téléchargé' });
  }
  
  // Accéder au fichier téléchargé
  const file = req.file;
  
  // Répondre avec le chemin du fichier ou une autre information
  res.status(200).json({ message: 'Fichier téléchargé avec succès', filePath: file.path });
});


// Route pour obtenir l'historique des PDF pour un utilisateur donné
router.get('/history', async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: 'L\'email de l\'utilisateur est requis.' });
  }

  try {
    const history = await PDFHistory.find({ userEmail });
    res.status(200).json(history);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});






module.exports = router;
