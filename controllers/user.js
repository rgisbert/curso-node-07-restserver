const {request, response} = require('express');

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: 'API - Delete desde el contrador',
  });
};

const usuariosGet = (req = request, res = response) => {
  const {q, nombre = 'Sin nombre', apikey, page = 1, limit = 10} = req.query; // ? Los enviados a través de URL ?q=hola&nombre=fernando&apikey=1234567890

  res.json({
    msg: 'API - Get desde el controlador',
    q,
    nombre,
    apikey,
    page,
    limit,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: 'API - Patch desde el controlador',
  });
};

const usuariosPost = (req = request, res = response) => {
  // Recoger datos del body
  const {nombre, edad} = req.body;

  res.status(201).json({
    msg: 'API - Post desde el controlador',
    nombre,
    edad,
  });
};

const usuariosPut = (req = request, res = response) => {
  const {id} = req.params; // ? Nombre definido en la ruta (/:id)

  res.json({
    msg: 'API - Put desde el controlador',
    id,
  });
};

module.exports = {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
};
