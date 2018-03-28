exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('patient', table => {
      table.dropColumn('scratchPad');
    })
    .alterTable('patient_info', table => {
      table.text('needToKnow');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable('patient', table => {
      table.text('scratchPad');
    })
    .alterTable('patient_info', table => {
      table.dropColumn('needToKnow');
    });
};
