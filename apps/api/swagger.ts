
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OpenCurrencyX API',
      version: '1.0.0',
      description: 'Open, free, production-ready currency API with history and conversion.',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
  },
  apis: ['./index.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default swaggerSpec;
