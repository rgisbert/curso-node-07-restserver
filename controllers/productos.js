const {Producto} = require('../models');

/**
 * Actualizar la información de un producto.
 * El estado no se actualiza desde aquí.
 */
const actualizarProducto = async (req, res) => {
  try {
    const {id} = req.params;
    // Extraigo datos no actualizables
    const {_id, estado, usuario, ...data} = req.body;

    // Preparar datos a actualizar
    if (data.nombre) {
      data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre');

    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar el producto',
      error,
    });
  }
};

/**
 * Marcar un producto como borrado en la colección (no lo borra realmente)
 */
const borrarProducto = async (req, res) => {
  try {
    const {id} = req.params;

    const productoDB = await Producto.findByIdAndUpdate(id, {estado: false});

    res.status(201).json(productoDB);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al borrar producto',
      error,
    });
  }
};

/**
 * Dar de alta un producto
 */
const crearProducto = async (req, res) => {
  // Extraigo los campos que no dependen del body
  const {estado, usuario, ...body} = req.body;

  try {
    // Guardar el id del usuario para la referencia
    const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuario._id,
    };

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al crear el producto',
      error,
    });
  }
};

/**
 * Devuelve la información del producto solicitado por id
 */
const obtenerProducto = async (req, res) => {
  try {
    const {id} = req.params;

    const productoDB = await Producto.findOne({_id: id, estado: true})
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre');

    // Verificar que tenga el estado true
    if (!productoDB) {
      return res.status(404).json({
        msg: 'El producto está dado de baja',
      });
    }

    res.status(201).json(productoDB);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al obtener el producto',
      error,
    });
  }
};

/**
 * Obtener listado de productos, con paginado
 */
const obtenerProductos = async (req, res) => {
  try {
    const {desde = 0, limite = 5} = req.query;

    const [totalProductos, productos] = await Promise.all([
      Producto.countDocuments({estado: true}),
      Producto.find({estado: true})
        .sort({nombre: 1})
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.status(200).json({
      totalProductos,
      productos,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error al obtener los productos',
      error,
    });
  }
};

module.exports = {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
};
