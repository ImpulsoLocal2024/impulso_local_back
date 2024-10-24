const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usamos la carpeta temporal de multer; luego la moveremos en el controlador
    cb(null, 'uploads/temp'); 
  },
  filename: function (req, file, cb) {
    // Guardamos el archivo temporalmente con un nombre único
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;

