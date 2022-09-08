const {ObjectId} = require('mongoose').Types;

const {Categoria, Producto, Usuario} = require('../models');

// === INTERNOS ===
/**
 * Devuelve true en caso de que tenga el formato de un MongoId
 * @param { String } value - Valor a comprobar si es MongoId
 * @returns { Boolean } Evalúa si "value" tiene formato de MongoId
 */
const esMongoID = (value) => ObjectId.isValid(value);

/**
 * Colecciones de parámetro permitidas para la búsqueda.
 */
const coleccionesPermitidas = ['categoria', 'producto', 'role', 'usuario'];

// === BÚSQUEDA DE COLECCIONES===

/**
 * Busca en la colección Categoría para devolver uno o varios valores.
 * Si se manda un id hará una búsqueda por id, sino tiene formato de ObjectId,
 * hace una búsqueda contra nombre sin distinguir entre mayúsculas y minúsculas
 * @param { ObjectId | String} termino - Si es un MongoId, busca por id, sino lo es, compara este valor contra nombre
 * @param { response } res - Response
 * @returns { Categoria | Categoria[] | [] } results
 */
const buscarCategorias = async (termino, res) => {
  if (esMongoID(termino)) {
    const categoria = await Categoria.findById(termino).populate(
      'usuario',
      'nombre img'
    );

    return res.status(categoria ? 201 : 404).json({
      results: categoria ? categoria : [],
    });
  }

  // No es un _id, buscar en resto de campos
  const regex = new RegExp(termino, 'i'); // Para no discriminar entre minúsculas y mayúsculas
  const categorias = await Categoria.find({
    nombre: regex,
    estado: true,
  })
    .sort({nombre: 1})
    .populate('usuario', 'nombre img');

  res.status(categorias ? 201 : 404).json({
    results: categorias ? categorias : [],
  });
};

/**
 *
 * @param { ObjectId | String } termino
 * @param { response } res - Objeto response de express
 * @returns { Producto | Producto[] | [] }
 */
const buscarProductos = async (termino, res) => {
  if (esMongoID(termino)) {
    const producto = await Producto.findById(termino)
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre');

    return res.status(producto ? 201 : 404).json({
      results: producto ? producto : [],
    });
  }

  // No es un id, hace búsqueda en el resto de campos
  const regex = new RegExp(termino, 'i');

  const productos = await Producto.find({
    $or: [{nombre: regex}, {descripcion: regex}],
    $and: [{estado: true}],
  })
    .sort({nombre: 1})
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

  res.status(productos ? 201 : 404).json({
    results: productos ? productos : [],
  });
};

/**
 * Busca un usuario (en caso de mandar un id), o puede hacer una búsqueda de nombre o correo que contenga "termino", no es case sensitive
 * @param { ObjectId | string } termino - Si es un MongoId, buscará por id, sino, compara contra nombre y correo de Usuario
 * @param { response } res - Response
 * @returns { Usuario | Usuario[] | []} results
 */
const buscarUsuarios = async (termino, res) => {
  if (esMongoID(termino)) {
    const usuario = await Usuario.findById(termino);

    // ? Para que todas las respuestas de este end-point se trabajen igual
    return res.json({
      // ! Sin datos, devolver array vacío
      results: usuario ? usuario : [],
    });
  }

  // Si llega aquí, no busca por _id
  const regex = new RegExp(termino, 'i');
  const usuarios = await Usuario.find({
    $or: [{nombre: regex}, {correo: regex}],
    $and: [{estado: true}],
  });

  res.json({
    results: usuarios ? usuarios : [],
  });
};

module.exports = {
  // Valores
  coleccionesPermitidas,

  // Funciones
  buscarCategorias,
  buscarProductos,
  buscarUsuarios,
};
