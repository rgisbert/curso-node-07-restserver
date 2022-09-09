const dbSearch = require('./db-search.js');
const dbValidators = require('./db-validators.js');
const generarJWT = require('./generar-jwt.js');
const subirArchivo = require('./subir-archivo.js');

module.exports = {
  ...dbSearch,
  ...dbValidators,
  ...generarJWT,
  ...subirArchivo,
};
