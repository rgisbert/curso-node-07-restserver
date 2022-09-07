const {Categoria} = require('../models/index.js');

/**
 * Actualiza una categoría (sólo el nombre) a partir de un id.
 */
const actualizarCategoria = async (req, res) => {
  const {id} = req.params;
  const {estado, usuario, ...data} = req.body;

  // adaptar datos
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  try {
    const categoriaDB = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    }).populate('usuario', 'nombre');

    res.status(201).json(categoriaDB);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar categoría',
      error,
    });
  }
};

/**
 * Cambia el estado de una Categoria a false para marcarla como "borrada"
 */
const borrarCategoria = async (req, res) => {
  const {id} = req.params;

  try {
    const categoriaDB = await Categoria.findByIdAndUpdate(
      id,
      {estado: false},
      {new: true}
    );

    res.json(categoriaDB);
  } catch (error) {
    res.status(500).json({
      msg: 'No se puedo actualizar la categoría',
      error,
    });
  }
};

/**
 * Crear categoría con un nombre dado
 */
const crearCategoria = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  // Comprobar que no exista
  const categoriaDB = await Categoria.findOne({nombre});

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoría ${nombre} ya existe.`,
    });
  }

  // Preparar datos a grabar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  // Guardar
  await categoria.save();

  res.status(201).json(categoria);
};

/**
 * Obtener una categoría, a partir de un ID
 */
const obtenerCategoria = async (req, res) => {
  const {id} = req.params;

  // Obtener la categoría seleccionada
  const categoriaDB = await Categoria.findOne({_id: id, estado: true}).populate(
    {
      path: 'usuario',
      select: 'nombre correo',
    }
  );

  // Condición por si, a pesar de existir el ID, la categoría está "borrada"
  if (!categoriaDB) {
    return res.status(400).json({
      categoria: null,
      msg: 'La categoría está "borrada".',
    });
  }

  res.status(201).json(categoriaDB);
};

/**
 * Obtener un listado de Categorías paginado
 */
const obtenerCategorias = async (req, res) => {
  const {desde = 0, limite = 5} = req.query;

  try {
    const [totalCategorias, categorias] = await Promise.all([
      Categoria.countDocuments({estado: true}),
      Categoria.find({estado: true})
        .sort({nombre: 1})
        .populate({
          path: 'usuario',
          select: 'nombre img',
        })
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.status(201).json({
      totalCategorias,
      categorias,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'No se ha podido obtener el listado',
      error,
    });
  }
};

module.exports = {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
};
