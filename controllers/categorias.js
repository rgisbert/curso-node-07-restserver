const {Categoria} = require('../models/index.js');

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

module.exports = {
  crearCategoria,
};
