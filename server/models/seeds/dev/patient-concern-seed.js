var uuid = require('uuid');

function buildConcern(title) {
  return {
    id: uuid.v4(),
    title,
  };
}

function buildPatientConcern(concernId, patientId, startedAt) {
  return {
    id: uuid.v4(),
    concernId,
    patientId,
    startedAt,
  };
}

function buildPatientGoal(title, patientId, patientConcernId) {
  return {
    id: uuid.v4(),
    title,
    patientId,
    patientConcernId,
  };
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
    createdById: assignedToId,
    // 2 weeks from now
    dueAt: new Date(+new Date() + 12096e5),
  };
}

function buildGoalSuggestionTemplate(title) {
  return {
    id: uuid.v4(),
    title,
  };
}

function buildTaskTemplate(title, goalSuggestionTemplateId) {
  const priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
  return {
    id: uuid.v4(),
    title,
    completedWithinNumber: 2,
    completedWithinInterval: 'week',
    repeating: false,
    goalSuggestionTemplateId,
    priority,
    careTeamAssigneeRole: 'physician',
  };
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
      buildConcern(
        'Inability to maintain the needed amount of medicine (or any health care) for self/family',
      ),
      buildConcern('Inability to maintain the needed amount of clothing for self/family'),
      buildConcern('Needed financial assistance, but no connection to entitlements'),
      buildConcern('Currently does not feel motivated to eat'),
      buildConcern('Currently does not have accompaniment for meals'),
      buildConcern('Currently does not have an appetite'),
      buildConcern('Currently is not physically able to cook or shop for food'),
      buildConcern('Member does not have accessible transportation options'),
      buildConcern('Member needs assistance for travel'),
      buildConcern('Member has difficulty sleeping'),
      buildConcern('Member experiences psychotic episodes'),
      buildConcern('Diabetes needs to be managed'),
      buildConcern('Diabetes medication not accessible'),
      buildConcern('Member suspected of having diabetes'),
      buildConcern('Member is not connected to mental health services'),
      buildConcern('Mental health makes it difficult to find employment'),
    ]);
}

function createPatientConcerns(knex, Promise, concernIds) {
  return knex
    .table('patient')
    .pluck('id')
    .then(function(patientIds) {
      const patientConcernPromises = [];

      for (let i = 0; i < patientIds.length; i++) {
        for (let j = 0; j < 8; j++) {
          const startedAt = j < 4 ? new Date().toISOString() : null;
          patientConcernPromises.push(
            knex
              .table('patient_concern')
              .insert(buildPatientConcern(concernIds[j], patientIds[i], startedAt)),
          );
        }
      }
      return Promise.all(patientConcernPromises);
    });
}

function createPatientGoals(knex, Promise) {
  return knex
    .table('patient_concern')
    .pluck('id')
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
                .insert(
                  buildPatientGoal(
                    'Assess eligibility for assistance',
                    patientIds[0],
                    patientConcernIds[i],
                  ),
                )
                .then(function() {
                  return knex
                    .table('patient_goal')
                    .insert(
                      buildPatientGoal(
                        'Collaborate with care team',
                        patientIds[0],
                        patientConcernIds[i],
                      ),
                    );
                });
            }),
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
                    .insert(
                      buildPatientTask(
                        'Apply for assistance via ARYA',
                        patientIds[0],
                        'medium',
                        userIds[Math.floor(Math.random() * userIds.length)],
                        patientGoalIds[i],
                      ),
                    )
                    .then(function() {
                      return knex
                        .table('task')
                        .insert(
                          buildPatientTask(
                            'Visit DANY office within two weeks',
                            patientIds[0],
                            'high',
                            userIds[Math.floor(Math.random() * userIds.length)],
                            patientGoalIds[i],
                          ),
                        )
                        .then(function() {
                          return knex
                            .table('task')
                            .insert(
                              buildPatientTask(
                                'Complete assessment for JSNOW Assitance',
                                patientIds[0],
                                'low',
                                userIds[Math.floor(Math.random() * userIds.length)],
                                patientGoalIds[i],
                              ),
                            );
                        });
                    });
                }),
            );
          }

          return Promise.all(patientTaskPromises);
        });
    });
}

function createGoalSuggestionTemplates(knex, Promise) {
  return knex
    .table('goal_suggestion_template')
    .returning('id')
    .insert([
      buildGoalSuggestionTemplate(
        'Complete full financial assessment to determine eligibility for assistance',
      ),
      buildGoalSuggestionTemplate(
        'Restructure/reformat health related materials to match learning needs',
      ),
      buildGoalSuggestionTemplate('Assess eligibility for a vocational or educational program'),
      buildGoalSuggestionTemplate('Assess need for assistance with financial management'),
      buildGoalSuggestionTemplate(
        'Maintain access to needed medications and health care appointments',
      ),
      buildGoalSuggestionTemplate('Collaborate with entitlements care team'),
      buildGoalSuggestionTemplate('Assess eligibility for phone resources'),
      buildGoalSuggestionTemplate('Research clothing resources'),
      buildGoalSuggestionTemplate('Assess childcare resources'),
      buildGoalSuggestionTemplate('Increase access to food'),
      buildGoalSuggestionTemplate('Increase social supports'),
      buildGoalSuggestionTemplate('Refer for medical or dental follow up'),
      buildGoalSuggestionTemplate('Assess for depression'),
      buildGoalSuggestionTemplate('Assess eligibility for SNAP benefits'),
      buildGoalSuggestionTemplate('Assess eligibility for food delivery service'),
      buildGoalSuggestionTemplate('Improve current transportation services'),
      buildGoalSuggestionTemplate('Create a plan for scheduling transportation'),
      buildGoalSuggestionTemplate(
        'Assess eligibility for cash assistance benefits to help cover transportation costs',
      ),
      buildGoalSuggestionTemplate('Obtain consistent accompaniment for travel needs'),
      buildGoalSuggestionTemplate('Obtain non-Medicaid transportation services'),
      buildGoalSuggestionTemplate('Initiate shelter intake process'),
      buildGoalSuggestionTemplate('Assess home for safety and general conditions'),
      buildGoalSuggestionTemplate('Assess eligibility for rent assistance'),
      buildGoalSuggestionTemplate('Assess eligibility for utility assistance'),
      buildGoalSuggestionTemplate(' Assess eligibility for supportive housing'),
    ]);
}

function createTaskTemplates(knex, Promise, goalSuggestionTemplateIds) {
  const taskTemplatePromises = [];

  for (let i = 0; i < goalSuggestionTemplateIds.length; i++) {
    taskTemplatePromises.push(
      knex
        .table('task_template')
        .insert(buildTaskTemplate('Accompany to housing interviews', goalSuggestionTemplateIds[i])),
      knex
        .table('task_template')
        .insert(
          buildTaskTemplate('Complete home assessment using JustFix', goalSuggestionTemplateIds[i]),
        ),
      knex
        .table('task_template')
        .insert(buildTaskTemplate('Review listings and open units', goalSuggestionTemplateIds[i])),
      knex
        .table('task_template')
        .insert(
          buildTaskTemplate('Apply for reduced MetroCard fare', goalSuggestionTemplateIds[i]),
        ),
    );
  }
  return Promise.all(taskTemplatePromises);
}

exports.seed = function(knex, Promise) {
  return createConcerns(knex)
    .then(function(concernIds) {
      return createPatientConcerns(knex, Promise, concernIds);
    })
    .then(function() {
      return createPatientGoals(knex, Promise);
    })
    .then(function() {
      return createPatientTasks(knex, Promise);
    })
    .then(function() {
      return createGoalSuggestionTemplates(knex, Promise).then(function(goalSuggestionTemplateIds) {
        return createTaskTemplates(knex, Promise, goalSuggestionTemplateIds);
      });
    });
};
