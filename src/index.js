import app from './app.js';
import logger from './configs/logger.js';

const PORT = process.env.PORT || 8000;

console.log(process.env.NODE_ENV);

let server;
server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});


// Handle Server Errors
const exitHandler = (error) => {
  if (error) {
    logger.error(error);
  }
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler(error);
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);