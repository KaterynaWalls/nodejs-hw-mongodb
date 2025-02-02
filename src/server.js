import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const logger = pinoHttp({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(logger);

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: `${req.url} not found`,
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  });

  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
