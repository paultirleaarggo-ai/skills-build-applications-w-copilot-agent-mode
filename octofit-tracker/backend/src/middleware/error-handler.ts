import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error && typeof error === 'object' && 'name' in error) {
    const typedError = error as {
      name: string;
      message?: string;
      status?: number;
    };
    if (
      typedError.name === 'RequestBodyError' ||
      typedError.name === 'ValidationError' ||
      typedError.name === 'CastError' ||
      (typedError.name === 'SyntaxError' && typedError.status === 400)
    ) {
      response.status(400).json({ error: typedError.message ?? 'Invalid request' });
      return;
    }
  }

  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 11000
  ) {
    response.status(409).json({ error: 'A record with that unique value already exists' });
    return;
  }

  console.error('Unhandled API error:', error);
  response.status(500).json({ error: 'Internal server error' });
};
