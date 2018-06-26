exports.up = async function(knex, Promise) {
  await knex.schema.raw(`
    UPDATE "user"
    SET "userRole" = 'Community_Health_Partner';

    CREATE TYPE user_role AS ENUM (
      'Behavioral_Health_Specialist',
      'Community_Health_Partner',
      'Outreach_Specialist',
      'Hub_Care_Coordinator',
      'Hub_RN',
      'Hub_Operations_Manager',
      'Member_Experience_Advocate',
      'Primary_Care_Physician',
      'Nurse_Practitioner',
      'Psychiatrist',
      'Nurse_Care_Manager',
      'Community_Engagement_Manager',
      'Behavioral_Health_Nurse_Practitioner',
      'Pharmacist',
      'Clinical_Operations_Lead',
      'Clinical_Operations_Manager',
      'Back_Office_Admin'
    )
  `);

  return knex.schema.table('user', table => {
    table
      .specificType('userRole', 'user_role')
      .notNullable()
      .defaultTo('Community_Health_Partner')
      .alter();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.raw('DROP TYPE IF EXISTS user_role');
  return knex.schema.table('user', table => {
    table
      .string('userRole')
      .nullable()
      .alter();
  });
};
