const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Lista de Regalos',
      version: '1.0.0',
      description: 'API para gestionar una lista de regalos',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 