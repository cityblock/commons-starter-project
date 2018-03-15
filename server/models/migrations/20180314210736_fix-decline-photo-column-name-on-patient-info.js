exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.renameColumn('hasDeclinedPhoto', 'hasDeclinedPhotoUpload');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.renameColumn('hasDeclinedPhotoUpload', 'hasDeclinedPhoto');
  });
};
