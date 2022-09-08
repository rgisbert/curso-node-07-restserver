const {
  buscarCategorias,
  buscarProductos,
  buscarUsuarios,
  coleccionesPermitidas,
} = require('../helpers/db-search.js');

const buscar = (req, res) => {
  try {
    const {coleccion, termino} = req.params;

    // Controlar que busque una colección permitida
    if (!coleccionesPermitidas.includes(coleccion)) {
      return res.status(400).json({
        msg: `Las colecciones permitidas son: "${coleccionesPermitidas.join(
          ', '
        )}" y "${coleccion}" no se encuentra entre ellas.`,
        coleccionSolicitada: coleccion,
        coleccionesPermitidas,
      });
    }

    // Elegir la que busca
    switch (coleccion) {
      case 'categoria':
        buscarCategorias(termino, res);
        break;

      case 'producto':
        buscarProductos(termino, res);
        break;

      case 'usuario':
        buscarUsuarios(termino, res);
        break;

      default:
        res.status(500).json({
          msg: 'Búsqueda sin detallar',
        });
    }
  } catch (error) {
    res.status(500).json({
      msg: 'No se pudo realizar la búsqueda',
      error,
    });
  }
};

module.exports = {
  buscar,
};
