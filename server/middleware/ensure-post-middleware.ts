import express from 'express';

export const ensurePostMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.method === 'POST') {
    return next();
  }
  return res.sendStatus(405);
};
