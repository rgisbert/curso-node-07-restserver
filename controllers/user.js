const {request, response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario.js');

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: 'API - Delete desde el contrador',
  });
};

const usuariosGet = async (req = request, res = response) => {
  // ? Los enviados a través de URL ?q=hola&nombre=fernando&apikey=1234567890
  const {desde = 0, limite = 5} = req.query;
  const query = {estado: true};

  // ? Con Promise.all más optimizado, simplemente bloquea la BD una vez y es más rápido (mitad de tiempo aprox.)
  // * De hacer las promesas por separado, accedería con la primera y al acabar, accedería la segunda
  const [usuarios, totalUsuarios] = await Promise.all([
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
    Usuario.countDocuments(query),
  ]);

  res.json({
    totalUsuarios,
    usuarios,
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
