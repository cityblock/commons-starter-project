import * as dotenv from 'dotenv';
dotenv.config();
/* tslint:disable no-var-requires */
require('@risingstack/trace');
/* tslint:enable no-var-requires */
import * as express from 'express';
import * as webpack from 'webpack';
import expressConfig from './express';

let logger = console;

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  /* tslint:disable no-var-requires */
  const CaptureOutput = require('./lib/capture-output').default;
  /* tslint:enable no-var-requires */

  const captureOutput = new CaptureOutput('web');
  captureOutput.capture();
  logger = captureOutput.logger;
}

const app = express();

export type Env = 'production' | 'development' | 'test';

export interface IMainOptions {
  env: Env;
}

export async function main(options: IMainOptions) {
  /* istanbul ignore next */
  if (options.env === 'development') {
    // enable webpack dev middleware
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require('../webpack/webpack.config');
    const devConfig = webpackConfig()[0];
    const compiler = webpack(devConfig);
    app.use(
      webpackDevMiddleware(compiler, { noInfo: true, publicPath: devConfig.output.publicPath }),
    );
    app.use(require('webpack-hot-middleware')(compiler));
  }

  await expressConfig(app, logger);
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
