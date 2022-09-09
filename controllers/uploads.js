const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const cargarArchivo = (req, res) => {
  // Validaciones
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({
      msg: 'No se han recibido archivos',
    });
  }

  // Obtener archivo y ruta
  const {archivo} = req.files;
  const extensionArchivo = archivo.name.split('.').at(-1);

  // Extensiones admitidas
  const extensionesValidas = ['gif', 'jpg', 'jpeg', 'png'];

  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      msg: `La extensión ${extensionArchivo} no se permite.`,
      extensionesValidas,
    });
  }

  let fileExists;
  let nombreRandom;
  let uploadPath;

  // Si la extensión es válida, cambiar archivo
  // En el poco probable caso que ya exista, generar otro
  do {
    nombreRandom = `${uuidv4()}.${extensionArchivo}`;
    uploadPath = path.join(__dirname, '../uploads/', nombreRandom);

    fileExists = fs.existsSync(uploadPath);
  } while (fileExists);

  // Mover el archivo a la carpeta del servidor
  archivo.mv(uploadPath, (err) => {
    if (err) return res.status(500).json({err});

    res.json({msg: `Archivo subido a: "${uploadPath}"`});
  });
};

module.exports = {
  cargarArchivo,
};
