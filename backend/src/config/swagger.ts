import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Transporte Universitário - Orleans',
      version: '1.0.0',
      description: 'Documentação da API para centralização e gestão de informações sobre transporte universitário de Orleans/SC.',
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js', './dist/routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);
