const {Categoria, Producto, Role, Usuario} = require('../models/index.js');

/**
 * Comprueba si existe categoría con el id facilitado.
 * @param {ObjectId} id - Identificador de la Categoría
 */
const categoriaExiste = async (id) => {
  const existeCategoria = await Categoria.findById(id);

  if (!existeCategoria) throw new Error(`La categoría ${id} no existe`);
};

/**
 * Comprobar si una cadena de texto está entre las permitidas.
 * @param { String } coleccion - Nombre de la colección a validar
 * @param { String[] } opcsPermitidas - Las opciones contra las que validarlas
 * @return { Boolean } Si colección está entre las opciones permitidas, devuelve true.
 */
const coleccionPermitida = (coleccion, opcsPermitidas) => {
  const incluida = opcsPermitidas.includes(coleccion);

  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida. Permitidas: ${opcsPermitidas}.`
    );
  }

  return true;
};

/**
 * Comprueba si el correo ya existe en la BD
 * @param {String} correo Mail a comprobarr
 */
const emailExiste = async (correo) => {
  const existeEmail = await Usuario.findOne({correo});

  if (existeEmail) throw new Error(`El mail ${correo} ya existe.`);
};

/**
 * Comprueba el si role que se quiere asignar a un usuario existe en la BD.
 * @param {String} rol Role a validar contra la BD
 */
const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({rol});

  if (!existeRol) throw new Error(`El rol "${rol}" no existe en la BD.`);
};

/**
 * Comprueba si exsite un usuario en la BD por id.
 * @param {MongoId} id Recibe el id a comprobar en BD
 */
const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);

  if (!existeUsuario) throw new Error(`El id ${id} no existe.`);
};

/**
 * Verificar que el nombre de Producto no exista en la colección
 * @param {String} nombre - Nombre del producto a guardar en la BD que debe ser único
 */
const nombreProductoUnico = async (nombre) => {
  const productoExiste = await Producto.findOne({nombre});

  if (productoExiste) throw new Error(`Ya existe el producto "${nombre}".`);
};

/**
 * Verificar si existe el Producto con el id facilitado
 * @param {ObjectId} id - Id del producto a consultar
 */
const productoExistePorId = async (id) => {
  const existeProducto = await Producto.findById(id);

  if (!existeProducto) throw new Error(`No existe el producto con id ${id}.`);
};

module.exports = {
  categoriaExiste,
  coleccionPermitida,
  emailExiste,
  esRoleValido,
  existeUsuarioPorId,
  nombreProductoUnico,
  productoExistePorId,
};
