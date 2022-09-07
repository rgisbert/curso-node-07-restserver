const {Router} = require('express');
const {check} = require('express-validator');

const {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
} = require('../controllers/categorias.js');

const {categoriaExiste} = require('../helpers/db-validators.js');

const {
  esAdminRole,
  validarCampos,
  validarJWT,
} = require('../middlewares/index.js');

const router = Router();

/**
 * "Borrar" una categoría, sigue estando en la BD, simplemente se marcará.
 * Servicio: privado.
 * Permiso: sólo personas con ADMIN_ROLE
 * @params {ObjectId} id - identificador de la categoría a borrar (rq.params)
 */
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos,
  ],
  borrarCategoria
);

/**
 * Obtener una categoría dada por id
 * Servicio: público
 * @param {ObjectId} id - identificador de la ruta (req.params)
 */
router.get(
  '/:id',
  [
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos,
  ],
  obtenerCategoria
);

/**
 * Obtener un listado de categorías, paginado. Además del total de categorías
 * Servicio: público
 */
router.get('/', obtenerCategorias);

/**
 * Crear categoría.
 * Servicio: privado.
 * Permiso: estar logueado (independientemente del rol en bD)
 * @params {Categoria} Objeto a crear (req.body)
 */
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

/**
 * Actualizar la categoría del id facilitado
 * Servicio: privado
 * Permiso: estar logueado (independientemente del rol en bD)
 * @param {ObjectId} id - identificador de la ruta (req.params)
 */
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(categoriaExiste),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

module.exports = router;
