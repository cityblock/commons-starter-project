import express from 'express';

const subscriptionsEndpoint = 'ws://localhost:3000/subscriptions';

export const addSecurityHeadersMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self' https://accounts.google.com blob:; script-src 'self' *.google.com  *.google-analytics.com unpkg.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline' blob:; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' *.googleusercontent.com *.google-analytics.com https://storage.googleapis.com https://s3.amazonaws.com/cdn.hellofax.com data: blob:; connect-src 'self' https://storage.googleapis.com ${subscriptionsEndpoint}; frame-ancestors 'self' https://app.hellosign.com/; frame-src https://app.hellosign.com/ https://accounts.google.com/;`,
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
};
