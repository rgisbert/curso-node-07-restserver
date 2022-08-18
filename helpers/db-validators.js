const Role = require('../models/role.js');

/**
 * Comprueba el si role que se quiere asignar a un usuario existe en la BD.
 * @param {String} rol Role a validar contra la BD
 */
const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({rol});

  if (!existeRol) throw new Error(`El rol "${rol}" no existe en la BD.`);
};

module.exports = {
  esRoleValido,
};
