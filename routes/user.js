const {Router} = require('express');
const {check} = require('express-validator');

const {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
} = require('../controllers/user.js');
const {emailExiste, esRoleValido} = require('../helpers/db-validators');
const {validarCampos} = require('../middlewares/validar-campos.js');

const router = Router();

router.delete('/', usuariosDelete);

router.get('/', usuariosGet);

router.patch('/', usuariosPatch);

// Como segundo parámetro el middleware de express-validator
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El email no es válido').isEmail(),
    check('correo', 'El email ya está registrado').custom(emailExiste),
    check('password', 'El password debe tener más de 6 letras').isLength({
      min: 6,
    }),
    // * Cambio de validación en rol, ahora, contra BD
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos, // Middleware propio para manejar la gestión de estos errores, por eso va último
  ], // Recoge el error en usuariosPost
  usuariosPost
);

router.put('/:id', usuariosPut); // ? Se recoge en req.params

module.exports = router;
