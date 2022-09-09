const path = require('path');

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
  const uploadPath = path.join(__dirname, '../uploads/', archivo.name);

  // Extensiones admitidas
  const extensionesValidas = ['gif', 'jpg', 'jpeg', 'png'];

  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      msg: `La extensión ${extensionArchivo} no se permite.`,
      extensionesValidas,
    });
  }

  // // Mover el archivo a la carpeta del servidor
  // archivo.mv(uploadPath, (err) => {
  //   if (err) return res.status(500).json({err});

  //   res.json({msg: `Archivo subido a: "${uploadPath}"`});
  // });
};

module.exports = {
  cargarArchivo,
};
