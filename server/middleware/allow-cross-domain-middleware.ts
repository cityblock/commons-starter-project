import express from 'express';

export const allowCrossDomainMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, auth_token');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else next();
};
