const {Router} = require('express');
const {check} = require('express-validator');

const {cargarArchivo} = require('../controllers/uploads.js');
const {validarArchivo} = require('../middlewares/index.js');

const router = Router();

// === RUTAS ===
router.post('/', [validarArchivo], cargarArchivo);

module.exports = router;
