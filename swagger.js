const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '1.0.0',
      description: 'API to manage books',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['index.js'], // Path to the file where your Express routes are defined
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;
