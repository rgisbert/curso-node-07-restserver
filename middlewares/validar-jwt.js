const {request, response} = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario.js');

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'Ha fallado la autenticación',
    });
  }

  try {
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - Usuario no existe en BD',
      });
    }

    // Verificar estado true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no válido - Usuario con estado false',
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      msg: 'Token no válido',
    });
  }
};

module.exports = {
  validarJWT,
};
