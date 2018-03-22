import { danger, fail, markdown, schedule, warn } from 'danger';
import * as fs from 'fs';
import { includes } from 'lodash';

const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile();

const modifiedMigrations = danger.git.modified_files
  .filter(p => includes(p, 'migrations/'))
  .filter(filesOnly);

if (modifiedMigrations.length > 0) {
  warn("This PR edited an existing migrations. Don't do that! cc: @zamiang");
}

const newMigrations = danger.git.created_files
  .filter(p => includes(p, 'migrations/'))
  .filter(filesOnly);

if (newMigrations.length > 0) {
  warn('This PR added migrations cc: @tzfirac');
}
