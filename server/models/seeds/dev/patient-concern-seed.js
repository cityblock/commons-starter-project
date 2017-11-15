var uuid = require('uuid');

function buildConcern(title) {
  return {
    id: uuid.v4(),
    title,
  }
}

function buildPatientConcern(concernId, patientId, startedAt) {
  return {
    id: uuid.v4(),
    concernId,
    patientId,
    startedAt,
  }
}

function buildPatientGoal(title, patientId, patientConcernId) {
  return {
    id: uuid.v4(),
    title,
    patientId,
    patientConcernId,
  }
}

function buildPatientTask(title, patientId, priority, assignedToId, patientGoalId) {
  return {
    id: uuid.v4(),
    title,
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
    printer took a galley of type and scrambled it to make a type specimen book.`,
    patientId,
    priority,
    assignedToId,
    patientGoalId,
    // 2 weeks from now
    dueAt: new Date(+new Date + 12096e5),
  }
}

function createConcerns(knex) {
  return knex
  .table('concern')
  .returning('id')
  .insert([
    buildConcern('Current housing is unstable'),
    buildConcern('Member cannot afford transportation'),
    buildConcern('Currently does not have access to food'),
    buildConcern('Requires assistance in maintaining finances'),
    buildConcern('Difficulties learning/communicating'),
    buildConcern('Inability to maintain the needed amount of childcare for family/dependents'),
    buildConcern('Inability to maintain the needed amount of medicine (or any health care) for self/family'),
    buildConcern('Inability to maintain the needed amount of clothing for self/family'),
  ])
}

function createPatientConcerns(knex, Promise, concernIds) {
  return knex
    .table('patient')
    .pluck('id')
    .then(function(patientIds) {
      const patientConcernPromises = [];

      for (let i = 0; i < patientIds.length; i++) {
        for (let j = 0; j < concernIds.length; j++) {
          const startedAt = j < 4 ? new Date().toISOString() : null
          patientConcernPromises.push(
            knex.table('patient_concern').insert(buildPatientConcern(concernIds[j], patientIds[i], startedAt)),
          );
        }
      }
      return Promise.all(patientConcernPromises);
    });
}

function createPatientGoals(knex, Promise) {
  return knex
    .table('patient_concern')
    .pluck('id',)
    .then(function(patientConcernIds) {
      const patientGoalPromises = [];

      for (let i = 0; i < patientConcernIds.length; i++) {
        patientGoalPromises.push(
          knex
            .table('patient_concern')
            .pluck('patientId')
            .where({ id: patientConcernIds[i] })
            .then(function(patientIds) {
              return knex
                .table('patient_goal')
                .insert(buildPatientGoal('Assess eligibility for assistance', patientIds[0], patientConcernIds[i]))
                .then(function() {
                  return knex
                    .table('patient_goal')
                    .insert(buildPatientGoal('Collaborate with care team', patientIds[0], patientConcernIds[i]))
              })
            })
        );
      }

      return Promise.all(patientGoalPromises);
    });
}

function createPatientTasks(knex, Promise) {
  return knex
    .table('user')
    .pluck('id')
    .then(function(userIds) {
      return knex
        .table('patient_goal')
        .pluck('id')
        .then(function(patientGoalIds) {
          const patientTaskPromises = [];

          for (let i = 0; i < patientGoalIds.length; i++) {
            patientTaskPromises.push(
              knex
                .table('patient_goal')
                .pluck('patientId')
                .where({ id: patientGoalIds[i] })
                .then(function(patientIds) {
                  return knex
                    .table('task')
                    .insert(buildPatientTask(
                      'Apply for assistance via ARYA',
                      patientIds[0],
                      'medium',
                      userIds[Math.floor(Math.random() * userIds.length)],
                      patientGoalIds[i]
                    )).then(function() {
                      return knex
                      .table('task')
                      .insert(buildPatientTask(
                        'Visit DANY office within two weeks',
                        patientIds[0],
                        'high',
                        userIds[Math.floor(Math.random() * userIds.length)],
                        patientGoalIds[i]
                      )).then(function() {
                        return knex
                        .table('task')
                        .insert(buildPatientTask(
                          'Complete assessment for JSNOW Assitance',
                          patientIds[0],
                          'low',
                          userIds[Math.floor(Math.random() * userIds.length)],
                          patientGoalIds[i]
                        ))
                      })
                    })
                  })
            )
          }

          return Promise.all(patientTaskPromises);
        });
    });
}

exports.seed = function(knex, Promise) {
  return createConcerns(knex)
    .then(function(concernIds) {
      return createPatientConcerns(knex, Promise, concernIds)
    })
    .then(function() {
      return createPatientGoals(knex, Promise)
    })
    .then(function() {
      return createPatientTasks(knex, Promise)
    });
};