exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('patient', table => {
      table
        .string('firstName')
        .notNullable()
        .alter();

      table
        .string('lastName')
        .notNullable()
        .alter();
    })
    .raw(
      `
    CREATE INDEX index_patient_full_name
    ON patient
    USING gin (("firstName" || ' ' || "lastName") gin_trgm_ops)
    `,
    );
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable('patient', table => {
      table
        .string('firstName')
        .nullable()
        .alter();

      table
        .string('lastName')
        .nullable()
        .alter();
    })
    .raw(
      `
    DROP INDEX index_patient_full_name
    `,
    );
};
