const multer = require('multer');
const path = require('path');

// Diretório onde as imagens vão ser guardadas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nome = file.fieldname + '-' + Date.now() + ext;
    cb(null, nome);
  }
});

// Filtro de tipos de ficheiro
const fileFilter = (req, file, cb) => {
  const tiposAceites = ['.png', '.jpg', '.jpeg', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (tiposAceites.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem inválido. Aceites: .png, .jpg, .jpeg, .webp'), false);
  }
};

// Config final
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;
