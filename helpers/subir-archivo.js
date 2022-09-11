const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');

/**
 * Guarda un archivo recibido a partir de req.files.ARCHIVO en la carpeta del servidor,
 * bien sea la principal o ruta hija a partir de "uploads".
 * Permite especificar las extensiones válidas que acepta la petición.
 * @param {request.files} files - Llave del objeto request que incluye los archivos
 * @param {string[]} extensionesValidas - Todas las extensiones válidas. @default ['gif', 'jpg', 'jpeg', 'png']
 * @param {string} carpeta - En caso de que haya ruta anidada
 * @returns
 */
const subirArchivo = (
  files,
  extensionesValidas = ['gif', 'jpg', 'jpeg', 'png'],
  carpeta = ''
) => {
  return new Promise((resolve, reject) => {
    // Obtener archivo y ruta
    const {archivo} = files;
    const extensionArchivo = archivo.name.split('.').at(-1);

    if (!extensionesValidas.includes(extensionArchivo)) {
      return reject({
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
      uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreRandom);

      fileExists = fs.existsSync(uploadPath);
    } while (fileExists);

    // Mover el archivo a la carpeta del servidor
    archivo.mv(uploadPath, (err) => {
      if (err) return reject(err);

      resolve({
        uploadPath,
        nombreArchivo: nombreRandom,
      });
    });
  });
};

module.exports = {
  subirArchivo,
};
