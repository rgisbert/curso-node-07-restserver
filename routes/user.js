const {Router} = require('express');
const {check} = require('express-validator');

const {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
} = require('../controllers/user.js');

const router = Router();

router.delete('/', usuariosDelete);

router.get('/', usuariosGet);

router.patch('/', usuariosPatch);

// Como segundo parámetro el middleware de express-validator
router.post(
  '/',
  [check('correo', 'El email no es válido').isEmail()], // Recoge el error en usuariosPost
  usuariosPost
);

router.put('/:id', usuariosPut); // ? Se recoge en req.params

module.exports = router;
