const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.info('BD online');
  } catch (error) {
    console.error(error);
    throw new Error('Error al iniciar la BD.');
  }
};

module.exports = {
  dbConnection,
};
