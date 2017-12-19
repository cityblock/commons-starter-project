var uuid = require('uuid');

function buildRiskAreaGroup(title) {
  return {
    id: uuid.v4(),
    title,
    mediumRiskThreshold: 12,
    highRiskThreshold: 24,
  };
}

function buildRiskArea(title, order, riskAreaGroupId, assessmentType = 'manual') {
  return {
    id: uuid.v4(),
    title,
    mediumRiskThreshold: 4,
    highRiskThreshold: 8,
    order,
    riskAreaGroupId,
    assessmentType,
  };
}

function buildQuestion(title, order, riskAreaId, answerType, computedFieldId = null) {
  return {
    id: uuid.v4(),
    title,
    order,
    riskAreaId,
    answerType,
    computedFieldId,
    applicableIfType: 'oneTrue',
  };
}

function buildComputedField(label, dataType, slug) {
  return {
    id: uuid.v4(),
    label,
    dataType,
    slug,
  };
}

function buildAnswer(questionId, order, displayValue, value, valueType, riskAdjustmentType, summaryText, inSummary = true) {
  return {
    id: uuid.v4(),
    questionId,
    order,
    displayValue,
    value,
    valueType,
    riskAdjustmentType,
    summaryText,
    inSummary,
  };
}

function buildPatientAnswer(answerId, patientId, answerValue = '') {
  return {
    id: uuid.v4(),
    answerId,
    patientId,
    answerValue,
    applicable: true,
  }
}

function createRadioQuestion(knex, riskAreaId, patientIds) {
  return knex.table('question').returning('id').insert(buildQuestion(
    'Where have you lived in the past 2 months?',
    1,
    riskAreaId,
    'radio',
    )).then(function(questionIds) {
    return knex.table('answer').returning('id').insert([
      buildAnswer(
        questionIds[0],
        1,
        'Drug Treatment',
        'drug treatment',
        'string',
        'increment',
        'Patient has unstable housing; currently residing in drug treatment',
      ),
      buildAnswer(
        questionIds[0],
        2,
        'Anywhere outside',
        'anywhere outside',
        'string',
        'forceHighRisk',
        'Patient is currently homeless; residing outside',
      ),
      buildAnswer(
        questionIds[0],
        3,
        'Hospital',
        'hospital',
        'string',
        'increment',
        'Patient has unstable housing; currently residing in the hospital',
      ),
      buildAnswer(
        questionIds[0],
        4,
        'Apt/House/Room',
        'apt/house/room',
        'string',
        'inactive',
        'Patient is currently residing Apt/House/Room',
      )
    ]).then(function(answerIds) {
      const patientAnswers = [];

      for (var i = 0; i < patientIds.length; i++) {
        patientAnswers.push(
          buildPatientAnswer(answerIds[1], patientIds[i]),
        )
      }
      return knex.table('patient_answer').insert(patientAnswers);
    })
  })
}

function createMultiselectQuestion(knex, riskAreaId, patientIds) {
  return knex.table('question').returning('id').insert(buildQuestion(
    'Who do you live with?',
    2,
    riskAreaId,
    'multiselect',
    )).then(function(questionIds) {
    return knex.table('answer').returning('id').insert([
      buildAnswer(
        questionIds[0],
        1,
        'Friend',
        'friend',
        'string',
        'inactive',
        'Patient currently living with a friend',
        false,
      ),
      buildAnswer(
        questionIds[0],
        2,
        'Roommate',
        'roommate',
        'string',
        'inactive',
        'Patient current living with a roommate',
        false,
      ),
      buildAnswer(
        questionIds[0],
        3,
        'Abusive partner',
        'abusive partner',
        'string',
        'forceHighRisk',
        'Patient currently living with an abusive partner',
      ),
      buildAnswer(
        questionIds[0],
        4,
        'Non-abusive partner',
        'nonabusive partner',
        'string',
        'inactive',
        'Patient current living with a non-abusive partner',
        false,
      ),
      buildAnswer(
        questionIds[0],
        5,
        'Child',
        'child',
        'string',
        'increment',
        'Patient currenlty living with child',
      ),
    ]).then(function(answerIds) {
      const patientAnswers = [];

      for (var i = 0; i < patientIds.length; i++) {
        patientAnswers.push(
          buildPatientAnswer(answerIds[2], patientIds[i]),
          buildPatientAnswer(answerIds[4], patientIds[i]),
        )
      }
      return knex.table('patient_answer').insert(patientAnswers);
    })
  })
}

function createDropdownQuestion(knex, riskAreaId, patientIds) {
  return knex.table('question').returning('id').insert(buildQuestion(
    'Is your name on the lease or mortgage of the place you live in?',
    3,
    riskAreaId,
    'dropdown',
    )).then(function(questionIds) {
    return knex.table('answer').returning('id').insert([
      buildAnswer(
        questionIds[0],
        1,
        'Yes',
        true,
        'boolean',
        'inactive',
        'Patient currently owns place of residince',
        false,
      ),
      buildAnswer(
        questionIds[0],
        2,
        'No',
        false,
        'boolean',
        'forceHighRisk',
        'Patient currently does not own place of residince',
        true,
      ),
    ]).then(function(answerIds) {
      const patientAnswers = [];

      for (var i = 0; i < patientIds.length; i++) {
        patientAnswers.push(
          buildPatientAnswer(answerIds[1], patientIds[i]),
        )
      }
      return knex.table('patient_answer').insert(patientAnswers);
    })
  })
}

function createFreetextQuestion(knex, riskAreaId, patientIds) {
  return knex.table('question').returning('id').insert(buildQuestion(
    'What is your current address?',
    4,
    riskAreaId,
    'freetext',
    )).then(function(questionIds) {
      return knex.table('answer').returning('id').insert([
        buildAnswer(
          questionIds[0],
          1,
          'free text',
          'free text',
          'string',
          'inactive',
          'free text',
          false,
        ),
      ]).then(function(answerIds) {
        const patientAnswers = [];

        for (var i = 0; i < patientIds.length; i++) {
          patientAnswers.push(
            buildPatientAnswer(answerIds[0], patientIds[i], 'Winterfell'),
          )
        }
        return knex.table('patient_answer').insert(patientAnswers);
      })
  })
}

function createDiabetesQuestion(knex, riskAreaId, patientIds, computedFieldId) {
  return knex.table('question').returning('id').insert(buildQuestion(
    'Pharmacy claim for insulin?', 1, riskAreaId, 'radio', computedFieldId
  )).then(function(questionIds) {
    return knex.table('answer').returning('id').insert([
      buildAnswer(
        questionIds[0],
        1,
        'Yes',
        true,
        'boolean',
        'forceHighRisk',
        'Patient is currently taking insulin',
      ),
      buildAnswer(
        questionIds[0],
        2,
        'No',
        false,
        'boolean',
        'inactive',
        'Patient is currently not taking insulin',
        false,
      ),
    ]).then(function(answerIds) {
      const patientAnswers = [];

      for (var i = 0; i < patientIds.length; i++) {
        patientAnswers.push(
          buildPatientAnswer(answerIds[0], patientIds[i]),
        )
      }
      return knex.table('patient_answer').insert(patientAnswers);
    })
  })
}

function createCHFQuestion(knex, riskAreaId, patientIds, computedFieldId) {
  return knex.table('question').returning('id').insert(buildQuestion(
    'ICD-10 Code for Congestive Heart Failure?', 1, riskAreaId, 'radio', computedFieldId
  )).then(function(questionIds) {
    return knex.table('answer').returning('id').insert([
      buildAnswer(
        questionIds[0],
        1,
        'Yes',
        true,
        'boolean',
        'forceHighRisk',
        'Patient is diagnosed with Congestive Heart Failure',
      ),
      buildAnswer(
        questionIds[0],
        2,
        'No',
        false,
        'boolean',
        'inactive',
        'Patient is not diagnosed with Congestive Heart Failure',
        false,
      ),
    ]).then(function(answerIds) {
      const patientAnswers = [];

      for (var i = 0; i < patientIds.length; i++) {
        patientAnswers.push(
          buildPatientAnswer(answerIds[0], patientIds[i]),
        )
      }
      return knex.table('patient_answer').insert(patientAnswers);
    })
  })
}


function createComputedFields(knex) {
  return knex.table('computed_field').returning('id').insert([
    buildComputedField('Has diabetes', 'boolean', 'has-diabetes'),
    buildComputedField('Congestive Heart Failure', 'boolean', 'congestive-heart-failure'),
  ]);
}

function createQuestions(knex, Promise, riskAreaIds, computedFieldIds) {
  return knex.table('patient').pluck('id').then(function(patientIds) {
    const questionPromises = [];

    for (var i = 0; i < riskAreaIds.length; i++) {
      if (i % 2 === 0) {
        questionPromises.push(
          createRadioQuestion(knex, riskAreaIds[i], patientIds),
          createMultiselectQuestion(knex, riskAreaIds[i], patientIds),
          createDropdownQuestion(knex, riskAreaIds[i], patientIds),
          createFreetextQuestion(knex, riskAreaIds[i], patientIds),
        )
      } else {
        questionPromises.push(
          createDiabetesQuestion(knex, riskAreaIds[i], patientIds, computedFieldIds[0]),
          createCHFQuestion(knex, riskAreaIds[i], patientIds, computedFieldIds[1]),
        )
      }
    }

    return Promise.all(questionPromises);
  })
}

function createRiskAreaGroupPromise(
  knex,
  Promise,
  riskAreaGroupTitle,
) {
  return knex
    .table('risk_area_group')
    .returning('id')
    .insert(
      buildRiskAreaGroup(riskAreaGroupTitle)
    ).then(function(riskAreaGroupIds) {
      return knex
        .table('risk_area')
        .returning('id')
        .insert([
          buildRiskArea(`${riskAreaGroupTitle} Assessment 1`, 1, riskAreaGroupIds[0]),
          buildRiskArea(`${riskAreaGroupTitle} - Diabetes`, 2, riskAreaGroupIds[0], 'automated'),
          buildRiskArea(`${riskAreaGroupTitle} Assessment 3`, 3, riskAreaGroupIds[0]),
          buildRiskArea(`${riskAreaGroupTitle} - Congestive Heart Failure`, 4, riskAreaGroupIds[0], 'automated'),
        ]).then(function(riskAreaIds) {
          return knex.table('computed_field').pluck('id').then(function(computedFieldIds) {
            return createQuestions(knex, Promise, riskAreaIds, computedFieldIds);
          });
        });
    });
}

function createRiskAreaGroups(knex, Promise) {
  const riskAreaGroupPromises = [
    createRiskAreaGroupPromise(knex, Promise, 'Housing'),
    createRiskAreaGroupPromise(knex, Promise, 'Medical Care'),
    createRiskAreaGroupPromise(knex, Promise, 'Mental Health'),
    createRiskAreaGroupPromise(knex, Promise, 'Food'),
    createRiskAreaGroupPromise(knex, Promise, 'Income-Entitlements-Education'),
    createRiskAreaGroupPromise(knex, Promise, 'Transportation'),
    createRiskAreaGroupPromise(knex, Promise, 'Social Support, Community, & Safety'),
    createRiskAreaGroupPromise(knex, Promise, 'Legal'),
  ];

  return Promise.all(riskAreaGroupPromises);
}

exports.seed = function(knex, Promise) {
  return createComputedFields(knex).then(function () {
    return createRiskAreaGroups(knex, Promise);
  });
}