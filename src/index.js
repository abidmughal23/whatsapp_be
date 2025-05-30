import mongoose from 'mongoose';
import app from './app.js';
import logger from './configs/logger.js';

const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process if MongoDB connection fails
});

// Connect to MongoDB 
mongoose.connect(DATABASE_URL ) 
  .then(() => {
    logger.info('Connected to MongoDB');
  });
 
// mongodb debugging mod
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
} 


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