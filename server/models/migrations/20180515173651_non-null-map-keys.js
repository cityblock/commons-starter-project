exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('task', table => {
    table
      .uuid('patientGoalId')
      .notNullable()
      .alter();

    table
      .uuid('patientId')
      .notNullable()
      .alter();
  });

  await knex.schema.alterTable('patient_goal', table => {
    table
      .uuid('patientConcernId')
      .notNullable()
      .alter();

    table
      .uuid('patientId')
      .notNullable()
      .alter();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('task', table => {
    table
      .uuid('patientGoalId')
      .nullable()
      .alter();

    table
      .uuid('patientId')
      .nullable()
      .alter();
  });

  await knex.schema.alterTable('patient_goal', table => {
    table
      .uuid('patientConcernId')
      .nullable()
      .alter();

    table
      .uuid('patientId')
      .nullable()
      .alter();
  });
};
