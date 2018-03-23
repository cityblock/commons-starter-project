import * as dotenv from 'dotenv';
dotenv.config();
import * as compression from 'compression';
import * as express from 'express';
import { Transaction } from 'objection';
import expressConfig from './express';

let logger = console;

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  /* tslint:disable no-var-requires */
  const CaptureOutput = require('./lib/capture-output').default;
  /* tslint:enable no-var-requires */

  const captureOutput = new CaptureOutput('web');
  captureOutput.capture();
  logger = captureOutput;
}

const app = express();

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  // compress all responses
  app.use(compression());
}

export type Env = 'production' | 'development' | 'test';

export interface IMainOptions {
  env: Env;
  transaction?: Transaction;
  allowCrossDomainRequests?: boolean;
}

export async function main(options: IMainOptions) {
  await expressConfig(app, logger, options.transaction, options.allowCrossDomainRequests);
  return (app as any).listen(app.get('port'));
}

/* istanbul ignore next */
if (require.main === module) {
  try {
    main({ env: process.env.NODE_ENV as Env });
  } catch (err) {
    console.error(err);
  }
}
