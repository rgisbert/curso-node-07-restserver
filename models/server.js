const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const {dbConnection} = require('../database/config.js');

class Server {
  // Rutas utilizadas
  #ownRoutes = new Map([
    ['authPath', '/api/auth'],
    ['buscarPath', '/api/buscar'],
    ['categoriasPath', '/api/categorias'],
    ['productosPath', '/api/productos'],
    ['uploadsPath', '/api/uploads'],
    ['usuariosPath', '/api/usuarios'],
  ]);

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Conexion a BD
    this.#conectarDB();

    // Middlewares
    this.#middlewares();

    // Rutas de la aplicación
    this.#routes();
  }

  async #conectarDB() {
    await dbConnection();
  }

  #middlewares() {
    // CORS
    this.app.use(cors());

    // Trabajar data del body
    this.app.use(express.json()); // ? Adapta cualquier información que le llegue al formato JSON

    // Directorio público
    this.app.use(express.static('public'));

    // Manejar carga de archivos con "express-fileupload"
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
      })
    );
  }

  #routes() {
    this.app.use(this.#ownRoutes.get('authPath'), require('../routes/auth.js'));

    this.app.use(
      this.#ownRoutes.get('buscarPath'),
      require('../routes/buscar.js')
    );

    this.app.use(
      this.#ownRoutes.get('categoriasPath'),
      require('../routes/categorias.js')
    );

    this.app.use(
      this.#ownRoutes.get('productosPath'),
      require('../routes/productos.js')
    );

    this.app.use(
      this.#ownRoutes.get('uploadsPath'),
      require('../routes/uploads.js')
    );

    this.app.use(
      this.#ownRoutes.get('usuariosPath'),
      require('../routes/user.js')
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor levantado en http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
