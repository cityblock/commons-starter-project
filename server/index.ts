import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import * as webpack from 'webpack';
import expressConfig from './express';

/* istanbul ignore if  */
if (process.env.NODE_ENV === 'production') {
  /* tslint:disable no-var-requires */
  const CaptureOutput = require('./lib/capture-output').default;
  /* tslint:enable no-var-requires */

  const captureOutput = new CaptureOutput('web');
  captureOutput.capture();
}

const app = express();

export interface IMainOptions {
  env: 'development' | 'production' | 'test';
}

export async function main(options: IMainOptions) {
  /* istanbul ignore if  */
  if (options.env === 'development') {
    // enable webpack dev middleware
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require('../webpack/webpack.config');
    const devConfig = webpackConfig()[0];
    const compiler = webpack(devConfig);
    app.use(webpackDevMiddleware(
      compiler, { noInfo: true, publicPath: devConfig.output.publicPath }),
    );
    app.use(require('webpack-hot-middleware')(compiler));
  }

  await expressConfig(app);
  return (app as any).listen(app.get('port'));
}

/* istanbul ignore if  */
if (require.main === module) {
  try {
    main({ env: process.env.NODE_ENV });
  } catch (err) {
    console.error(err);
  }
}
