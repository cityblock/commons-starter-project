var uuid = require('uuid');
const allPokemon = require('../all-pokemon');
const createItems = require('../create-items');

const deleteTables = (knex, Promise) =>
  knex.transaction(function(trx) {
    const deletePromises = trx
      .withSchema('information_schema')
      .select('table_name')
      .from('tables')
      .whereRaw(`table_catalog = ? AND table_schema = ? AND table_name != ?`, [
        trx.client.database(),
        'public',
        'knex_migrations',
      ])
      .map(function(row) {
        return trx.raw(`TRUNCATE TABLE public.${row.table_name} CASCADE`);
      });

    return Promise.all(deletePromises);
  });

const seed = (knex, Promise) => knex.table('pokemon').insert(allPokemon);

exports.seed = (knex, Promise) =>
  deleteTables(knex, Promise)
    .then(() => {
      return seed(knex, Promise);
    })
    .then(() => {
      return createItems(knex, Promise);
    })
    .catch(err => {
      console.error(err);
    });
