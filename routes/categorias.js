const {Router} = require('express');
const {check} = require('express-validator');

const {} = require('../controllers/categorias.js');
const {validarCampos} = require('../middlewares/validar-campos.js');

const router = Router();

/**
 * "Borrar" una categoría, sigue estando en la BD, simplemente se marcará.
 * Servicio: privado.
 * Permiso: sólo personas con ADMIN_ROLE
 * @params {ObjectId} id - identificador de la categoría a borrar (rq.params)
 */
router.delete('/:id', (req, res) => {
  res.json({
    msg: 'DELETE por ID',
    id: req.params.id,
  });
});

/**
 * Obtener todas las categorías
 * Servicio: público
 */
router.get('/', (req, res) => {
  res.json({
    msg: 'GET',
  });
});

/**
 * Obtener una categoría dada por id
 * Servicio: público
 * @param {ObjectId} id - identificador de la ruta (req.params)
 */
router.get('/:id', (req, res) => {
  res.json({
    msg: 'GET por iD',
    id: req.params.id,
  });
});

/**
 * Crear categoría.
 * Servicio: privado.
 * Permiso: estar logueado (independientemente del rol en bD)
 * @params {Categoria} Objeto a crear (req.body)
 */
router.post('/', (req, res) => {
  res.json({
    msg: 'POST Categoría',
    [req.body]: req.body,
  });
});

/**
 * Actualizar la categoría del id facilitado
 * Servicio: privado
 * Permiso: estar logueado (independientemente del rol en bD)
 * @param {ObjectId} id - identificador de la ruta (req.params)
 */
router.put('/:id', (req, res) => {
  res.json({
    msg: 'PUT por iD',
    id: req.params.id,
  });
});

module.exports = router;
