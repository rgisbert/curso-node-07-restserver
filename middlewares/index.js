const validarCampos = require('./validar-campos.js');
const validarJWT = require('./validar-jwt.js');
const validarRoles = require('./validar-roles.js');

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validarRoles,
};
