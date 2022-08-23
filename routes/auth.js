const {Router} = require('express');
const {check} = require('express-validator');

const {login} = require('../controllers/auth.js');
const {validarCampos} = require('../middlewares/validar-campos.js');

const router = Router();

router.post(
  '/login',
  [
    check('correo', 'Debe enviar un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
