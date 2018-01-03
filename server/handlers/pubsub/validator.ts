import * as crypto from 'crypto';
import * as express from 'express';
import config from '../../config';
import { IPubsubMessageData } from './push-handler';

export function createHmac(data: string) {
  const hmacSecret = config.PUBSUB_HMAC_SECRET;

  return crypto
    .createHmac('SHA256', hmacSecret)
    .update(data)
    .digest('hex');
}

/* tslint:disable no-console */
export function pubsubValidator(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let computedHmac: string | null = null;
  let reqHmac: string | null = null;
  let data: IPubsubMessageData = {};

  try {
    data = JSON.parse(Buffer.from(req.body.message.data, 'base64').toString('utf-8'));
  } catch (err) {
    console.error('Problem parsing message data');
    res.sendStatus(200);
    return;
  }

  try {
    reqHmac = req.body.message.attributes.hmac;
    computedHmac = createHmac(JSON.stringify(data));
  } catch (err) {
    console.error('Unauthorized');
    res.sendStatus(200);
    return;
  }

  if (!computedHmac || !reqHmac) {
    console.error('Unauthorized');
    res.sendStatus(200);
    return;
  }

  if (reqHmac === computedHmac) {
    req.body.message.data = data;
    next();
  } else {
    console.error('Unauthorized');
    res.sendStatus(200);
    return;
  }
}
/* tslint:enable no-console */
