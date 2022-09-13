const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2;

const {subirArchivo} = require('../helpers');
const {Producto, Usuario} = require('../models');

cloudinary.config(process.env.CLOUDINARY_URL);

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
 * Guardar imagen en Cloudinary, relacionada a un id de usuario o producto
 */
const actualizarImagenCloudinary = async (req, res) => {
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
    // Limpiar imagen previa del servidor para no acumularlas
    if (modelo.img) {
      const archivo = modelo.img.split('/').at(-1);
      const [public_id] = archivo.split('.'); // Separa el id de la extensión

      // Borrar la imagen de cloudinary
      cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;

    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
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

/**
 * Devuelve la ruta de uma imagen solicitada
 */
const mostrarImagen = async (req, res) => {
  try {
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

    if (modelo.img) {
      const pathImagen = path.join(
        __dirname,
        '../uploads/',
        coleccion,
        modelo.img
      );

      if (fs.existsSync(pathImagen)) {
        // ! No devuelve json, sino archivo
        return res.sendFile(pathImagen);
      }
    }

    // Si el id no tiene imagen asociada, devuelve imagen predefinida
    return res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
  } catch (error) {
    return res.status(500).json({
      msg: `Error al devolver la imagen la imagen.`,
      error,
    });
  }
};

module.exports = {
  actualizarImagen,
  actualizarImagenCloudinary,
  cargarArchivo,
  mostrarImagen,
};
