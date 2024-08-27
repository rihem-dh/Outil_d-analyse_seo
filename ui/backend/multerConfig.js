const multer = require('multer');
const path = require('path');

// Configuration de multer pour stocker les fichiers PDF dans un dossier spécifique
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom du fichier avec horodatage
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Vérifier que le fichier est un PDF
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
    }
  },
});

module.exports = upload;
