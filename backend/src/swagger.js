const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Lista de Regalos',
    version: '1.0.0',
    description: 'API para gestionar lista de regalos usando números de teléfono como identificadores',
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:5001',
      description: 'Servidor de desarrollo',
    },
  ],
  paths: {
    '/api/gifts/{phone}': {
      get: {
        tags: ['Regalos'],
        summary: 'Obtener lista de regalos',
        description: 'Obtiene todos los regalos asociados a un número de teléfono',
        parameters: [
          {
            in: 'path',
            name: 'phone',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Número de teléfono del usuario',
            example: '+525512345678'
          }
        ],
        responses: {
          200: {
            description: 'Lista de regalos obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Gift'
                  }
                }
              }
            }
          },
          500: {
            description: 'Error del servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/gifts': {
      post: {
        tags: ['Regalos'],
        summary: 'Crear nuevo regalo',
        description: 'Crea un nuevo regalo asociado a un número de teléfono',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone', 'name'],
                properties: {
                  phone: {
                    type: 'string',
                    example: '+525512345678'
                  },
                  name: {
                    type: 'string',
                    example: 'PlayStation 5'
                  },
                  description: {
                    type: 'string'
                  },
                  url: {
                    type: 'string'
                  },
                  image: {
                    type: 'string'
                  },
                  isPublic: {
                    type: 'boolean'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Regalo creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Gift'
                }
              }
            }
          },
          400: {
            description: 'Datos inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          500: {
            description: 'Error del servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Gift: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          userId: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          url: {
            type: 'string'
          },
          image: {
            type: 'string'
          },
          isPublic: {
            type: 'boolean'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string'
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 