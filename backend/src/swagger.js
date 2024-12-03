const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Regalo App',
    version: '1.0.0',
    description: 'Documentación de la API de Regalo App',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Ingresa tu token JWT con el formato: Bearer <token>'
      },
    },
    schemas: {
      Auth: {
        type: 'object',
        required: ['phone', 'verificationCode'],
        properties: {
          phone: {
            type: 'string',
            example: '+525512345678',
            description: 'Número de teléfono con código de país'
          },
          verificationCode: {
            type: 'string',
            example: '123456',
            description: 'Código de verificación recibido por SMS'
          },
        },
      },
      Gift: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { 
            type: 'string',
            example: 'PlayStation 5'
          },
          description: { 
            type: 'string',
            example: 'Consola de videojuegos'
          },
          url: { 
            type: 'string',
            example: 'https://www.amazon.com/ps5'
          },
          image: { 
            type: 'string',
            example: 'https://example.com/ps5.jpg'
          },
          isPublic: { 
            type: 'boolean',
            default: true
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string'
          }
        }
      }
    },
  },
  security: [{
    bearerAuth: []
  }],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 