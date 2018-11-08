const { allPokemon } = require('../../../pokemon-mocks');
const { buildRandomItem } = require('../../../item-mocks');

function deleteTables(knex, Promise) {
  return knex.transaction(function (trx) {
    const deletePromises = trx
      .withSchema('information_schema')
      .select('table_name')
      .from('tables')
      .whereRaw(`table_catalog = ? AND table_schema = ? AND table_name != ?`, [
        trx.client.database(),
        'public',
        'knex_migrations',
      ])
      .map(function (row) {
        return trx.raw(`TRUNCATE TABLE public.${row.table_name} CASCADE`);
      });

    return Promise.all(deletePromises);
  });
}

function createItems(knex, Promise) {
  return knex
    .table('pokemon')
    .pluck('id')
    .then(function (pokemonIds) {
      const itemPromises = [];
      for (let i = 0; i < pokemonIds.length; i++) {
        for (let j = 0; j < 3; j++) {
          itemPromises.push(knex.table('item').insert(buildRandomItem(pokemonIds[i])));
        }
      }
      return Promise.all(itemPromises);
    });
}

const seed = function (knex, Promise) {
  return knex
    .table('pokemon')
    .insert(pokemonMocks);
};

exports.seed = function (knex, Promise) {
  return deleteTables(knex, Promise).then(function () {
    return seed(knex, Promise).then(function () {
      return createItems(knex, Promise);
    });
  });
};
