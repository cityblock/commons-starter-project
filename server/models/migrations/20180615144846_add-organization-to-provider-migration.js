var uuid = require('uuid');

exports.up = function(knex, Promise) {
  return Promise.resolve()
    .then(() =>
      knex.schema.alterTable('patient_external_provider', table => {
        return table
          .uuid('patientExternalOrganizationId')
          .references('id')
          .inTable('patient_external_organization');
      }),
    )
    .then(async () => {
      const organizations = await knex('patient_external_organization')
        .select('id', 'patientId', 'name')
        .where('deletedAt', null);
      await Promise.all(
        organizations.map(org => {
          return knex('patient_external_provider')
            .update({ patientExternalOrganizationId: org.id })
            .where('patientId', org.patientId)
            .where('agencyName', org.name);
        }),
      );

      const providers = await knex('patient_external_provider')
        .distinct('patientId', 'agencyName')
        .where('patientExternalOrganizationId', null)
        .select('patientId', 'agencyName');
      const newOrgs = await Promise.all(
        providers.map(provider => {
          return { patientId: provider.patientId, name: provider.agencyName, id: uuid() };
        }),
      );

      await knex('patient_external_organization').insert(newOrgs);

      return Promise.all(
        newOrgs.map(org => {
          return knex('patient_external_provider')
            .update({ patientExternalOrganizationId: org.id })
            .where('patientId', org.patientId)
            .where('agencyName', org.name);
        }),
      );
    })
    .then(() =>
      knex.schema.raw(`
      ALTER TABLE patient_external_provider
        ALTER COLUMN "patientExternalOrganizationId" SET NOT NULL
    `),
    )
    .then(() =>
      knex.schema.alterTable('patient_external_provider', table => {
        return table.dropColumn('agencyName');
      }),
    );
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_external_provider', table => {
    table
      .string('agencyName')
      .notNullable()
      .defaultTo('');
    table.dropColumn('patientExternalOrganizationId');
  }).raw(`
    ALTER TABLE patient_external_provider ALTER COLUMN "agencyName" DROP DEFAULT
  `);
};
