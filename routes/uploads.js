const {Router} = require('express');
const {check} = require('express-validator');

const {actualizarImagen, cargarArchivo} = require('../controllers/uploads.js');
const {coleccionPermitida} = require('../helpers');
const {validarArchivo, validarCampos} = require('../middlewares/index.js');

const router = Router();

// === RUTAS ===
router.post('/', [validarArchivo], cargarArchivo);

router.put(
  '/:coleccion/:id',
  [
    validarArchivo,
    check('id', 'Debe ser un id válido de Mongo').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionPermitida(c, ['usuario', 'producto'])
    ),
    validarCampos,
  ],
  actualizarImagen
);

module.exports = router;
