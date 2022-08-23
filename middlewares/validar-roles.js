const esAdminRole = (req, res, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: 'Verificar el rol sin verificar primero el JWT',
    });
  }

  const {nombre, rol = 'NO_ROLE'} = req.usuario;

  if (rol !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${nombre} no es administrador, no tiene los permisos necesarios.`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Verificar el rol sin verificar primero el JWT',
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `El usuario no puede ejecutar la acción porque no es: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRole,
};
