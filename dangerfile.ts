import { danger, fail, markdown, schedule, warn } from 'danger';
import fs from 'fs';
import { includes } from 'lodash';

const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile();

const modifiedMigrations = danger.git.modified_files
  .filter(p => includes(p, 'migrations/'))
  .filter(filesOnly);

const checkPackageJson = async () => {
  const packageDiff = await danger.git.diffForFile('package.json');

  if (packageDiff) {
    const problematicModules = [
      'kue',
      'react-beautiful-dnd',
      '@react-pdf/core',
      '@react-pdf/node',
      'chart.js',
    ];
    problematicModules.map(name => {
      if (packageDiff.added.includes(name)) {
        warn(
          `Please be careful updating the node module "${name}". Ensure you have tested locally and then test it on staging before deploy`,
        );
      }
    });
  }
};

checkPackageJson();

if (modifiedMigrations.length > 0) {
  warn("This PR edited an existing migration. Don't do that! cc: @zamiang");
}

const newMigrations = danger.git.created_files
  .filter(p => includes(p, 'migrations/'))
  .filter(filesOnly);

if (newMigrations.length > 0) {
  warn('This PR added migrations cc: @tzfirac @paradhaks');
  warn(
    'Did this PR add migrations for tables in builder? If so, be sure to update the builder foreign tables in the production db and then update the copy from staging to production script. More info [here](https://github.com/cityblock/commons#builder-in-production)',
  );
}
