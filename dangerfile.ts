import { danger, fail, markdown, schedule, warn } from 'danger';
import * as fs from 'fs';
import { includes } from 'lodash';

const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile();

// Custom subsets of known files
const modifiedMigrations = danger.git.modified_files
  .filter(p => includes(p, 'migrations/'))
  .filter(filesOnly);

if (modifiedMigrations.length > 0) {
  warn('This PR added migrations cc: @tzfirac');
}
