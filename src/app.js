import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import MongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';

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
app.use(MongoSanitize());

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

app.post('/test', (req, res) => {
  res.send(req.body);
});

export default app;