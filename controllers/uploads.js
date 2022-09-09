const {subirArchivo} = require('../helpers');

const cargarArchivo = (req, res) => {
  subirArchivo(req.files)
    .then((msg) => res.status(201).json({fullPath: msg}))
    .catch((err) => res.status(500).json({err}));
};

module.exports = {
  cargarArchivo,
};
