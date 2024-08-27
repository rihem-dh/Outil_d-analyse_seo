const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Créer un nouvel utilisateur
router.post('/', async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Récupérer un utilisateur par email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Mettre à jour les informations d'un utilisateur
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    }, { new: true });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
