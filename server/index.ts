import * as dotenv from 'dotenv';
dotenv.config();
/* tslint:disable no-var-requires */
require('@risingstack/trace');
/* tslint:enable no-var-requires */
import * as express from 'express';
import * as webpack from 'webpack';
import expressConfig from './express';

if (process.env.NODE_ENV === 'production') {
  /* tslint:disable no-var-requires */
  const CaptureOutput = require('./lib/capture-output').default;
  /* tslint:enable no-var-requires */

  const captureOutput = new CaptureOutput('web');
  captureOutput.capture();
}

const app = express();

interface IMainOptions {
  env: 'development' | 'production' | 'test';
}

export async function main(options: IMainOptions) {
  if (options.env === 'development') {
    // enable webpack dev middleware
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require('../webpack/webpack.config');
    const devConfig = webpackConfig()[0];
    const compiler = webpack(devConfig);
    app.use(webpackDevMiddleware(
      compiler, { noInfo: true, publicPath: devConfig.output.publicPath }),
    );
  }

  await expressConfig(app);
  return app.listen(app.get('port'));
}

if (require.main === module) {
  try {
    main({ env: process.env.NODE_ENV });
  } catch (err) {
    console.error(err);
  }
}
