const validarArchivo = require('./validar-archivos.js');
const validarCampos = require('./validar-campos.js');
const validarJWT = require('./validar-jwt.js');
const validarRoles = require('./validar-roles.js');

module.exports = {
  ...validarArchivo,
  ...validarCampos,
  ...validarJWT,
  ...validarRoles,
};
