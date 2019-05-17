import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import config from '../server/config';

/*
 * __dirname is changed after webpack-ed to another directory
 * so process.cwd() is used instead to determine the correct base directory
 * Read more: https://nodejs.org/api/process.html#process_process_cwd
 */
const CURRENT_WORKING_DIR = process.cwd();

export default {
  app: path.resolve(CURRENT_WORKING_DIR, 'app'),
  assets: path.resolve(CURRENT_WORKING_DIR, 'public'),
  modules: path.resolve(CURRENT_WORKING_DIR, 'node_modules'),
  public: `${config.ASSET_URL}/`,
};
