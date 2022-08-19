const {request, response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario.js');

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: 'API - Delete desde el contrador',
  });
};

const usuariosGet = (req = request, res = response) => {
  const {q, nombre = 'Sin nombre', apikey, page = 1, limit = 10} = req.query; // ? Los enviados a través de URL ?q=hola&nombre=fernando&apikey=1234567890

  res.json({
    msg: 'API - Get desde el controlador',
    q,
    nombre,
    apikey,
    page,
    limit,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: 'API - Patch desde el controlador',
  });
};

const usuariosPost = async (req = request, res = response) => {
  // Recoger datos del body
  const {nombre, correo, password, rol} = req.body;
  const usuario = new Usuario({nombre, correo, password, rol}); // Crea la instancia, sin grabarla

  // Encriptar la contraseña
  // ? genSaltSync: número de vueltas para encriptar, por defecto, en 10
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();

  res.status(200).json({
    msg: 'API - Post desde el controlador',
    usuario,
  });
};

const usuariosPut = async (req = request, res = response) => {
  try {
    const {id} = req.params; // ? Nombre definido en la ruta (/:id)
    // ! Extraemos parámetros por seguridad, aunque no vengan, para no actualizar lo que no se debe
    const {_id, google, password, correo, ...resto} = req.body;

    // TODO validar contra la BD

    if (password) {
      // Encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
      msg: 'API - Put actualizado',
      usuario,
    });
  } catch (error) {
    res.status(400).json({
      msg: 'No se pudo actualizar el usuario',
    });
  }
};

module.exports = {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
};
