import * as crypto from 'crypto';
import * as express from 'express';
import config from '../../config';

export function createHmac(data: string) {
  const hmacSecret = config.PUBSUB_HMAC_SECRET;

  return crypto
    .createHmac('SHA256', hmacSecret)
    .update(data)
    .digest('hex');
}

export function pubsubValidator(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let computedHmac: string | null = null;
  let reqHmac: string | null = null;

  try {
    reqHmac = req.body.message.attributes.hmac;
    computedHmac = createHmac(req.body.message.data);
  } catch (err) {
    res.status(401).end();
  }

  if (!computedHmac || !reqHmac) {
    res.status(401).end();
  }

  if (reqHmac === computedHmac) {
    next();
  } else {
    res.status(401).end();
  }
}
