var uuid = require('uuid');

function deleteTables(knex, Promise) {
  return knex.transaction(function(trx) {
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
}

function buildPuppy(name) {
  return {
    id: uuid.v4(),
    name,
  };
}

function createPuppies(knex, clinicIds) {
  return knex
    .table('puppy')
    .insert([buildPuppy('Katy'), buildPuppy('Rose'), buildPuppy('Lord Barkington')]);
}

const seed = function(knex, Promise) {
  return createPuppies(knex);
};

exports.seed = function(knex, Promise) {
  return deleteTables(knex, Promise).then(function() {
    return seed(knex, Promise);
  });
};
