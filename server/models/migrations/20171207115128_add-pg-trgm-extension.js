
exports.up = function(knex, Promise) {
  return knex.schema.raw('create extension if not exists pg_trgm');
};

exports.down = function(knex, Promise) {
  return knex.schema.raw('drop extension if exists pg_trgm');
};
