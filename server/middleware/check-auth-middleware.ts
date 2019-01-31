import basicAuth from 'basic-auth';
import express from 'express';

export const checkAuthMiddleware = (username: string, password: string) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const user = basicAuth(req);

  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }

  next();
};
