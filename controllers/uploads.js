const fs = require('fs');
const path = require('path');

const {subirArchivo} = require('../helpers');
const {Producto, Usuario} = require('../models');

/**
 * Guardar imagen relacionada a un id de usuario o producto
 */
const actualizarImagen = async (req, res) => {
  const {coleccion, id} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuario':
      modelo = await Usuario.findById(id);
      break;

    case 'producto':
      modelo = await Producto.findById(id);
      break;

    default:
      return res
        .status(500)
        .json({msg: `Colección ${coleccion} sin registrar.`});
  }

  // Comprobar que tenga datos
  if (!modelo) {
    return res
      .status(404)
      .json({msg: `No se ha encontrado en id ${id} en ${coleccion}`});
  }

  try {
    const {nombreArchivo} = await subirArchivo(req.files, undefined, coleccion);

    // Limpiar imagen previa del servidor para no acumularlas
    if (modelo.img) {
      const pathImagen = path.join(
        __dirname,
        '../uploads/',
        coleccion,
        modelo.img
      );

      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }

    // Guardar información
    modelo.img = nombreArchivo;

    // Guardar en modelo
    await modelo.save({new: true});

    return res.json({
      modelo,
    });
  } catch (error) {
    return res.status(500).json({
      msg: `Error al actualizar la imagen en ${coleccion}.`,
      error,
    });
  }
};

/**
 * Sube un archivo a la ruta "uploads" validando las extensiones permitidas.
 * También permite crear una carpeta hija donde guardar la imagen solicitada
 */
const cargarArchivo = (req, res) => {
  subirArchivo(req.files, undefined, 'imgs')
    .then((msg) => res.status(201).json({msg}))
    .catch((err) => res.status(500).json({err}));
};

module.exports = {
  actualizarImagen,
  cargarArchivo,
};
