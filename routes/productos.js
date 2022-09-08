const {Router} = require('express');
const {check} = require('express-validator');

const {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
} = require('../controllers/productos.js');

const {
  categoriaExiste,
  nombreProductoUnico,
  productoExistePorId,
} = require('../helpers/db-validators.js');

const {
  validarCampos,
  validarJWT,
  esAdminRole,
} = require('../middlewares/index.js');

// Instancia de router
const router = Router();

// == RUTAS ==
/**
 * "Borrar" un producto, pero sigue estando en la BD, simplemente se marca como false.
 * Servicio: privado.
 * Permiso: sólo para personas con ADMIN_ROLE
 * @param { ObjectId } id - identificador del producto a borrar
 */
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'Se requiere un ID válido').isMongoId(),
    check('id').custom(productoExistePorId),
    validarCampos,
  ],
  borrarProducto
);

/**
 * Obtener un producto por id.
 * Servicio: público
 * @param { ObjectId } id - Identificador del producto a mostrar
 */
router.get(
  '/:id',
  [
    check('id', 'Se requiere un ID válido').isMongoId(),
    check('id').custom(productoExistePorId),
    validarCampos,
  ],
  obtenerProducto
);

/**
 * Obtener un listado de productos, paginado. Además muestar el total de productos.
 * Servicio: público
 */
router.get('/', obtenerProductos);

/**
 * Crear producto.
 * Servicio: privado.
 * Permiso: estar logueado (no se tiene en cuenta el rol del usuario)
 * @params { Producto } Objecto a crear
 */
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(nombreProductoUnico),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('categoria', 'La categoría no es un ID válido').isMongoId(),
    check('categoria').custom(categoriaExiste),
    validarCampos,
  ],
  crearProducto
);

/**
 * Actualizar producto del id referenciado.
 * Servicio: privado.
 * Permiso: estar logueado (no importa qué rol tenga)
 * @param { Producto } Objeto a actualizar
 */
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'Se requiere un ID válido').isMongoId(),
    check('id').custom(productoExistePorId),
    check('categoria', 'La categoría no es un ID válido').isMongoId(),
    validarCampos,
  ],
  actualizarProducto
);

module.exports = router;
