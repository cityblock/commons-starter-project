exports.up = async function(knex, Promise) {
  return knex.schema.alterTable('patient_contact', table => {
    table.dropColumn('canContact');
  });
};

exports.down = async function(knex, Promise) {
  return knex.schema.alterTable('patient_contact', table => {
    table.boolean('canContact');
  });
};
