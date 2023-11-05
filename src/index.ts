import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import { updateEvent } from './modules/utils';
import logger from './modules/logger/logger';
import axios from 'axios';

let server: any;
const connectToDB = async() => {
  try{
    await mongoose.connect(config.mongoose.url).then(() => {
      logger.info('Connected to MongoDB...');
      server = app.listen(config.port, () => {
        logger.info(`Server listening on port ${config.port}`);
        updateEvent()
      });
    });
  } catch(error: any){
    setTimeout(connectToDB, 5000);
    logger.error(error.message)
  }
}

connectToDB();

setInterval(()=>{
  console.log('Initiating scheduling...');
  axios.get(`https://api.trietix.com/api/v1`)
    .then((res)=> console.log(`Pinged: ${res.status}`))
    .catch((err)=> console.log(`Error pinging server: ${err}`))
}, 10*60*1000)

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