import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { UPLOAD_DIR } from './constants/path.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();

export const setupServer = () => {
  const app = express();
  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use(cookieParser());

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
