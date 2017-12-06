exports.up = async function(knex, Promise) {
  await knex.schema.table('question', table => {
    table
      .uuid('computedFieldId')
      .references('id')
      .inTable('computed_field');
  });
  await knex.schema.table('patient_answer', table => {
    table.string('mixerJobId');
  });
  await knex.schema.table('care_plan_suggestion', table => {
    table
      .uuid('computedFieldId')
      .references('id')
      .inTable('computed_field');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('question', table => {
    table.dropColumn('computedFieldId');
  });
  await knex.schema.table('patient_answer', table => {
    table.dropColumn('mixerJobId');
  });
  await knex.schema.table('care_plan_suggestion', table => {
    table.dropColumn('computedFieldId');
  });
};
