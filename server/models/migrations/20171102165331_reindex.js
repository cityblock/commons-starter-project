exports.up = async function(knex, Promise) {
  await knex.schema.raw(`REINDEX DATABASE ${knex.client.database()}`);
};
exports.down = function(knex) {
  return knex.schema;
};
exports.config = {
  transaction: false, // REINDEX DATABASE can't be performed in a transaction
};
