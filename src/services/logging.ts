import config from '@/config';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Current log level (can be adjusted based on environment)
// In production, we typically only want to show WARN and above
const currentLogLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN;

// Format log message with timestamp and level
const formatLogMessage = (level: string, message: string, data?: any): string => {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
};

// Main logging functions
export const debug = (message: string, data?: any): void => {
  if (currentLogLevel <= LogLevel.DEBUG) {
    console.debug(formatLogMessage('DEBUG', message, data));
  }
};

export const info = (message: string, data?: any): void => {
  if (currentLogLevel <= LogLevel.INFO) {
    console.info(formatLogMessage('INFO', message, data));
  }
};

export const warn = (message: string, data?: any): void => {
  if (currentLogLevel <= LogLevel.WARN) {
    console.warn(formatLogMessage('WARN', message, data));
  }
};

export const error = (message: string, error?: any): void => {
  if (currentLogLevel <= LogLevel.ERROR) {
    console.error(formatLogMessage('ERROR', message, error));
    
    // In a real app, you could send errors to a service like Sentry
    // if running in production
    if (!import.meta.env.DEV) {
      // sendToExternalService(message, error);
    }
  }
};

export const fatal = (message: string, error?: any): void => {
  if (currentLogLevel <= LogLevel.FATAL) {
    console.error(formatLogMessage('FATAL', message, error));
    
    // Always send fatal errors to monitoring service if in production
    if (!import.meta.env.DEV) {
      // sendToExternalService(message, error, true);
    }
  }
};

// Initialize logger
export const initializeLogging = (): void => {
  // Set up global error handlers
  if (typeof window !== 'undefined') {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      error('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      error('Unhandled promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }
  
  info('Logging initialized', { 
    appName: config.app.name, 
    appVersion: config.app.version,
    environment: import.meta.env.MODE
  });
};

// Function that would send logs to an external service
// In a real app, this would integrate with Sentry, LogRocket, etc.
const sendToExternalService = (message: string, data?: any, isFatal = false): void => {
  // This is just a stub - in a real app, you'd implement the integration
  // with your logging service
  console.log(`Would send to external service: ${message}`, data, isFatal);
};

export default {
  debug,
  info,
  warn,
  error,
  fatal,
  initializeLogging,
};