const {model, Schema} = require('mongoose');

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
  },
  // Marca eliminado
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  precio: {
    type: Number,
    default: 0,
  },
  descripcion: {
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
});

// Extraer las propiedades que no quiero mostrar, se aplica a todas las peticiones
ProductoSchema.methods.toJSON = function () {
  const {__v, estado, ...producto} = this.toObject();
  return producto;
};

module.exports = model('Producto', ProductoSchema);
