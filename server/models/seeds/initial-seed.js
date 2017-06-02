var uuid = require('uuid');

exports.seed = function(knex, Promise) {
  return knex.table('clinic')
    .returning('id')
    .insert({
      id: uuid.v4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Clinic Zero',
      departmentId: 1,
    })
    .then(function(clinicIds) {
      return knex.table('user')
        .insert([
          {
            id: uuid.v4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            firstName: 'Logan',
            lastName: 'Hasson',
            userRole: 'physician',
            email: 'logan@sidewalklabs.com',
            homeClinicId: clinicIds[0],
            athenaProviderId: 2,
          }, {
            id: uuid.v4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            firstName: 'Brennan',
            lastName: 'Moore',
            userRole: 'physician',
            email: 'brennan@sidewalklabs.com',
            homeClinicId: clinicIds[0],
            athenaProviderId: 3,
          }, {
            id: uuid.v4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            firstName: 'Frank',
            lastName: 'Guzzone',
            userRole: 'physician',
            email: 'frank@sidewalklabs.com',
            homeClinicId: clinicIds[0],
            athenaProviderId: 4,
          }
        ])
        .then(function() {
          return knex.table('clinic').pluck('id')
            .then(function(clinicIds) {
              return knex.table('patient')
                .returning('id')
                .insert([
                  {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Carmen',
                    lastName: 'Vasbinder',
                    athenaPatientId: 1,
                    homeClinicId: clinicIds[0],
                    gender: 'F',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Minh',
                    lastName: 'Marceau',
                    athenaPatientId: 2,
                    homeClinicId: clinicIds[0],
                    gender: 'M',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Florentino',
                    lastName: 'Berge',
                    athenaPatientId: 3,
                    homeClinicId: clinicIds[0],
                    gender: 'M',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Jacquiline',
                    lastName: 'Santore',
                    athenaPatientId: 4,
                    homeClinicId: clinicIds[0],
                    gender: 'F',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Lan',
                    lastName: 'Overstreet',
                    athenaPatientId: 5,
                    homeClinicId: clinicIds[0],
                    gender: 'F',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Toby',
                    lastName: 'Hartshorn',
                    athenaPatientId: 6,
                    homeClinicId: clinicIds[0],
                    gender: 'M',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Birdie',
                    lastName: 'Wansley',
                    athenaPatientId: 7,
                    homeClinicId: clinicIds[0],
                    gender: 'F',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Emery',
                    lastName: 'Official',
                    athenaPatientId: 8,
                    homeClinicId: clinicIds[0],
                    gender: 'M',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Candace',
                    lastName: 'Kimberlin',
                    athenaPatientId: 9,
                    homeClinicId: clinicIds[0],
                    gender: 'F',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Ula',
                    lastName: 'Hertel',
                    athenaPatientId: 10,
                    homeClinicId: clinicIds[0],
                    gender: 'F',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Rolland',
                    lastName: 'Auman',
                    athenaPatientId: 11,
                    homeClinicId: clinicIds[0],
                    gender: 'M',
                  }, {
                    id: uuid.v4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    firstName: 'Barney',
                    lastName: 'Ober',
                    athenaPatientId: 12,
                    homeClinicId: clinicIds[0],
                    gender: 'M',
                  },
                ])
            })
            .then(function(patientIds) {
              return knex.table('user').pluck('id')
                .then(function(userIds) {
                  const careTeamPromises = [];
                  for (let i = 0; i < patientIds.length; i++) {
                    for (let j = 0; j < userIds.length; j++) {
                      careTeamPromises.push(knex.table('care_team').insert({
                        id: uuid.v4(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        userId: userIds[j],
                        patientId: patientIds[i],
                      }));
                    }
                  }
                  return Promise.all(careTeamPromises);
                });
            });
        });
    });
};
