import winston from 'winston';

// Custom format to handle errors
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack,
    };
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    process.env.NODE_ENV === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.printf(({ level, message, stack, ...meta }) => {
      return `${level}: ${stack || message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ''
      }`;
    })
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export default logger;
