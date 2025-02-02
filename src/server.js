import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/contacts', contactsRouter);
  app.use(errorHandler);
  app.use(notFoundHandler);
  app.use(logger);

  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
