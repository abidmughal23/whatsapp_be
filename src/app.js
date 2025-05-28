import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import createHttpError from 'http-errors';
import router from './routes/index.routes.js';

dotenv.config(); 

const app = express();

// Morgan is a logging middleware for Node.js HTTP servers
if (process.env.NODE_ENV !== 'production') {
  // Use morgan for logging in development mode
  app.use(morgan('dev'));
}

// Helmet is a middleware that helps secure Express apps by setting various HTTP headers
app.use(helmet()); // Helmet helps secure Express apps by setting various HTTP headers

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Sanitization middleware to prevent NoSQL injection attacks
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query); // Only sanitizes, doesn't reassign
  next();
});

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to compress response bodies
app.use(compression());

// Middleware to handle file uploads
app.use(fileUpload({
  useTempFiles: true,
}));

// CORS middleware to allow cross-origin requests
app.use(cors());

// Mounting the main router for handling routes
app.use('/api/v1', router);


app.post('/test', (req, res) => {
  throw createHttpError.BadRequest('This is a test error'); // Example route to test error handling
});

app.use((req, res, next) => {
  // Handle 404 errors
  next(createHttpError.NotFound('This route does not exist'));
});

// Middleware to handle 404 errors
app.use(async(err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error:{
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
    }
  })
})

export default app;