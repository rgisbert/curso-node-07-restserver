const Role = require('../models/role.js');
const Usuario = require('../models/usuario.js');

/**
 * Comprueba si el correo ya existe en la BD
 * @param {String} correo Mail a comprobarr
 */
const emailExiste = async (correo) => {
  const existeEmail = await Usuario.findOne({correo});

  if (existeEmail) throw new Error(`El mail ${correo} ya existe.`);
};

/**
 * Comprueba el si role que se quiere asignar a un usuario existe en la BD.
 * @param {String} rol Role a validar contra la BD
 */
const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({rol});

  if (!existeRol) throw new Error(`El rol "${rol}" no existe en la BD.`);
};

module.exports = {
  emailExiste,
  esRoleValido,
};
