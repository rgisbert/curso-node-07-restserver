const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

// Sobreescribir el método para cambiar el comportamiento (No queremos que devuelva al contraseña)
// ! Debe ser función normal (no de flecha), porque hay que trabajar con this (la instancia creada)
UsuarioSchema.methods.toJSON = function () {
  // Eliminar los que no queremos devolver
  const {__v, password, ...usuario} = this.toObject();

  return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
