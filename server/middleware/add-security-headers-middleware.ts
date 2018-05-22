import * as express from 'express';
import config from '../config';

const subscriptionsEndpoint = config.SUBSCRIPTIONS_ENDPOINT;

export const addSecurityHeadersMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self' https://accounts.google.com blob:; script-src 'self' *.google.com unpkg.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline' blob:; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' *.googleusercontent.com https://storage.googleapis.com data: blob:; connect-src 'self' https://storage.googleapis.com ${subscriptionsEndpoint}; frame-ancestors 'none'`,
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
};
