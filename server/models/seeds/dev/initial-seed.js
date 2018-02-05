var uuid = require('uuid');

function deleteTables(knex, Promise) {
  return knex.transaction(function(trx) {
    const deletePromises = trx
      .withSchema('information_schema')
      .select('table_name')
      .from('tables')
      .whereRaw(`table_catalog = ? AND table_schema = ? AND table_name != ?`, [
        trx.client.database(),
        'public',
        'knex_migrations',
      ])
      .map(function(row) {
        return trx.raw(`TRUNCATE TABLE public.${row.table_name} CASCADE`);
      });

    return Promise.all(deletePromises);
  });
}

function buildClinic(name, departmentId) {
  return {
    id: uuid.v4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name,
    departmentId,
  };
}

function buildPhysician(firstName, lastName, email, homeClinicId, athenaProviderId) {
  return {
    id: uuid.v4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    firstName,
    lastName,
    userRole: 'physician',
    email,
    homeClinicId,
    athenaProviderId,
  };
}

function buildPatient(firstName, lastName, athenaPatientId, homeClinicId, gender) {
  return {
    id: uuid.v4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    firstName,
    lastName,
    athenaPatientId,
    homeClinicId,
    gender,
  };
}

function buildCareTeam(userId, patientId) {
  return {
    id: uuid.v4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
    patientId,
  };
}

function createPhysicians(knex, clinicIds) {
  return knex
    .table('user')
    .insert([
      buildPhysician('Logan', 'Hasson', 'logan@cityblock.com', clinicIds[0], 2),
      buildPhysician('Brennan', 'Moore', 'brennan@cityblock.com', clinicIds[0], 3),
      buildPhysician('Frank', 'Guzzone', 'frank@cityblock.com', clinicIds[0], 4),
      buildPhysician('Mat', 'Balez', 'mat@cityblock.com', clinicIds[0], 5),
      buildPhysician('Peter', 'Weinberg', 'peter@cityblock.com', clinicIds[0], 7),
      buildPhysician('Toyin', 'Ajayi', 'toyin@cityblock.com', clinicIds[0], 8),
      buildPhysician('Iyah', 'Romm', 'iyah@cityblock.com', clinicIds[0], 9),
      buildPhysician('Bay', 'Gross', 'bay@cityblock.com', clinicIds[0], 10),
      buildPhysician('Ari', 'Rosner', 'ari@cityblock.com', clinicIds[0], 11),
      buildPhysician('Ariane', 'Tschumi', 'ariane@cityblock.com', clinicIds[0], 12),
      buildPhysician('Tristan', 'Williams', 'tristan@cityblock.com', clinicIds[0], 13),
      buildPhysician('Laura', 'Cressman', 'laura@cityblock.com', clinicIds[0], 27),
    ]);
}

function createPatients(knex, clinicIds) {
  return knex
    .table('patient')
    .returning('id')
    .insert([
      buildPatient('Carmen', 'Vasbinder', 1, clinicIds[0], 'female'),
      buildPatient('Minh', 'Marceau', 2, clinicIds[0], 'male'),
      buildPatient('Florentino', 'Berge', 3, clinicIds[0], 'male'),
      buildPatient('Jacquiline', 'Santore', 4, clinicIds[0], 'female'),
      buildPatient('Lan', 'Overstreet', 5, clinicIds[0], 'female'),
      buildPatient('Toby', 'Hartshorn', 6, clinicIds[0], 'male'),
      buildPatient('Birdie', 'Wansley', 7, clinicIds[0], 'female'),
      buildPatient('Emery', 'Official', 8, clinicIds[0], 'male'),
      buildPatient('Candace', 'Kimberlin', 9, clinicIds[0], 'female'),
      buildPatient('Ula', 'Hertel', 10, clinicIds[0], 'female'),
      buildPatient('Rolland', 'Auman', 11, clinicIds[0], 'male'),
      buildPatient('Barney', 'Ober', 12, clinicIds[0], 'male'),
    ]);
}

function createCareTeam(knex, Promise, patientIds) {
  return knex
    .table('user')
    .pluck('id')
    .then(function(userIds) {
      const careTeamPromises = [];
      for (let i = 0; i < patientIds.length; i++) {
        for (let j = 0; j < userIds.length; j++) {
          careTeamPromises.push(
            knex.table('care_team').insert(buildCareTeam(userIds[j], patientIds[i])),
          );
        }
      }
      return Promise.all(careTeamPromises);
    });
}

const seed = function(knex, Promise) {
  return knex
    .table('clinic')
    .returning('id')
    .insert(buildClinic('Clinic Zero', 1))
    .then(function(clinicIds) {
      return createPhysicians(knex, clinicIds).then(function() {
        return knex
          .table('clinic')
          .pluck('id')
          .then(function(clinicIds) {
            return createPatients(knex, clinicIds);
          })
          .then(function(patientIds) {
            return createCareTeam(knex, Promise, patientIds);
          });
      });
    });
};

exports.seed = function(knex, Promise) {
  return deleteTables(knex, Promise).then(function() {
    return seed(knex, Promise);
  });
};
