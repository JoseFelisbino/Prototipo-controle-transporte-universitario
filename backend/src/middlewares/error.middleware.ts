import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 400; // default to bad request for service-thrown errors
  const message = err.message || 'Ocorreu um erro inesperado no servidor.';

  // If it's a real unexpected internal exception, log it
  if (!err.status || err.status === 500) {
    console.error('[Internal Error]:', err);
  }

  res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
