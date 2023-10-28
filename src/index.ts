import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './modules/logger/logger';

let server: any;
const connectToDB = async() => {
  try{
    await mongoose.connect(config.mongoose.url).then(() => {
      logger.info('Connected to MongoDB...');
      server = app.listen(config.port, () => {
        logger.info(`Server listening on port ${config.port}`);
      });
    });
  } catch(error: any){
    setTimeout(connectToDB, 5000);
    logger.error(error.message)
  }
}

connectToDB();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});