import { ErrorReporting } from '@google-cloud/error-reporting';
import express from 'express';
import config from '../../config';
import Logging from '../../logging';

export async function checkRedisHandler(req: express.Request, res: express.Response) {
  const errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });
  const logger = Logging.get();
  const auth = 'Basic ' + Buffer.from(`jobManager:${config.KUE_UI_PASSWORD}`).toString('base64');
  try {
    const response = await fetch(config.KUE_STATS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    });
    const json = await response.json();
    logger.log(`KUE STATUS: ${JSON.stringify(json)}`);
    res.status(200).send(JSON.stringify(json));
  } catch (error) {
    errorReporting.report('Redis check failed!');
    errorReporting.report(error);
    console.error(error);
    res.status(500).send(error.message);
  }
}
