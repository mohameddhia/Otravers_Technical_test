const path = require('path')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Otravers_Technical_Test API',
      version: '1.0.0',
      description: 'API documentation for avers_Technical_Test',
      contact: {
        name: 'Mohamed Dhia',
        email: 'meddhia.bf@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Dev'
      },

    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken' // The name of the cookie used for authentication
        }
      }
    },
    security: [
      {
        cookieAuth: [] // Apply cookieAuth globally to all endpoints
      }
    ]
  },
  apis: [
    path.resolve('./routes/**/*.js'),
    path.resolve('./config/**/*.component.js')
  ]
};

module.exports = swaggerOptions;