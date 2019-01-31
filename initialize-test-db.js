const Knex = require('knex');
const knexConfig = require('./server/models/knexfile');
function initializeDatabase() {
  if (process.env.NODE_ENV === 'test') {
    const knex = Knex(knexConfig['test']);
    return knex.raw(`CREATE EXTENSION IF NOT EXISTS btree_gist`).then(res => {
      knex.migrate.latest().then(() => {
        knex.destroy();
      });
    });
  }
}

initializeDatabase();
