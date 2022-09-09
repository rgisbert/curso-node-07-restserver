const {Router} = require('express');
const {check} = require('express-validator');

const {cargarArchivo} = require('../controllers/uploads.js');
const {validarCampos} = require('../middlewares/index.js');

const router = Router();

// === RUTAS ===
router.post('/', cargarArchivo);

module.exports = router;
