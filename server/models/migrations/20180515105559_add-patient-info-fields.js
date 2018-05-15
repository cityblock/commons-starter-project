exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.enu('maritalStatus', [
      'currentlyMarried',
      'widowed',
      'divorced',
      'separated',
      'neverMarried',
    ]);
    table.string('genderFreeText');
    table.enu('transgender', ['yes', 'no', 'pass']);
    table.dropColumn('sexAtBirth');
  }).raw(`
      ALTER TABLE "patient_info"
      DROP CONSTRAINT "patient_info_gender_check",
      ADD CONSTRAINT "patient_info_gender_check"
      CHECK ("gender" IN (
        'male',
        'female',
        'nonbinary',
        'transgender',
        'selfDescribed',
        'pass'
      ))
    `).raw(`
      UPDATE "patient_info"
      SET gender = 'selfDescribed', transgender = 'yes'
      WHERE gender = 'transgender'
    `).raw(`
      ALTER TABLE "patient_info"
      DROP CONSTRAINT "patient_info_gender_check",
      ADD CONSTRAINT "patient_info_gender_check"
      CHECK ("gender" IN (
        'male',
        'female',
        'nonbinary',
        'selfDescribed',
        'pass'
      ))
    `);
};

exports.down = function(knex, Promise) {
  return knex.schema
    .raw(
      `
      UPDATE "patient_info"
      SET gender = NULL
      WHERE gender = 'selfDescribed' OR gender = 'pass'
    `,
    )
    .raw(
      `
      ALTER TABLE "patient_info"
      DROP CONSTRAINT "patient_info_gender_check",
      ADD CONSTRAINT "patient_info_gender_check"
      CHECK ("gender" IN (
        'male',
        'female',
        'nonbinary',
        'transgender'
      ))
    `,
    )
    .raw(
      `
      UPDATE "patient_info"
      SET gender = 'transgender'
      WHERE transgender = 'yes'
    `,
    )
    .alterTable('patient_info', table => {
      table.dropColumn('maritalStatus');
      table.dropColumn('genderFreeText');
      table.dropColumn('transgender');
      table.enu('sexAtBirth', ['male', 'female']);
    });
};
