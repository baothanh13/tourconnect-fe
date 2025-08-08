const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Test API Backend Node.js with Swagger',
  },
  servers: [
    {
      url: 'http://localhost:5000', // URL backend của bạn
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
     },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Đường dẫn file API routes của bạn (tùy chỉnh theo project)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
