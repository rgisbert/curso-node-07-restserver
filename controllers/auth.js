const {request, response} = require('express');

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario.js');

const login = async (req = request, res = response) => {
  const {correo, password} = req.body;

  try {
    // Verificar existe email y activo
    const usuario = await Usuario.findOne({
      correo,
      estado: true,
    });

    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos. - Correo o estado',
      });
    }

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos. - Password',
      });
    }

    // Generar JWT

    res.json({
      msg: 'logIn OK.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'No se pudo completar la petición de login',
    });
  }
};

module.exports = {
  login,
};
