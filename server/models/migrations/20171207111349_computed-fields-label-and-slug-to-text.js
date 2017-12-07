exports.up = async function(knex, Promise) {
  await knex.schema.raw(`alter table computed_field alter column label type text`);
  await knex.schema.raw(`alter table computed_field alter column slug type text`);
};

exports.down = async function(knex, Promise) {
  await knex.schema.raw(`alter table computed_field alter column label type varchar(255)`);
  await knex.schema.raw(`alter table computed_field alter column slug type varchar(255)`);
};
