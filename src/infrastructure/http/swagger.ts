import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Temperature Sensor API', version: '1.0.0' },
  },
  apis: [
    './src/infrastructure/http/routes/*.ts',
    './dist/src/infrastructure/http/routes/*.js'
  ],
};
export const swaggerDocument = swaggerJsdoc(options);