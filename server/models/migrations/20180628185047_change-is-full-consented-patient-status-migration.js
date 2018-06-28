exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    UPDATE "computed_patient_status"
    SET "isFullConsentSigned" = FALSE
    WHERE "isFullConsentSigned" is NULL
  `);
};

exports.down = function(knex, Promise) {};
