const {Router} = require('express');

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

router.post('/', usuariosPost);

router.put('/:id', usuariosPut); // ? Se recoge en req.params

module.exports = router;
