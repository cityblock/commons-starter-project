import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  ComputedFieldDataTypes,
  UserRole,
} from 'schema';

import Answer from '../../models/answer';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Clinic from '../../models/clinic';
import ComputedField from '../../models/computed-field';
import Concern from '../../models/concern';
import ConcernSuggestion from '../../models/concern-suggestion';
import GoalSuggestion from '../../models/goal-suggestion';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import { createRiskArea } from '../../spec-helpers';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import { createSuggestionsForComputedFieldAnswer } from '../suggestions';

interface ISetup {
  patient: Patient;
  user: User;
  clinic: Clinic;
  riskArea: RiskArea;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'physician' as UserRole), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  return { clinic, user, patient, riskArea };
}

describe('createSuggestionsForComputedFieldAnswer', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('creates the correct suggestions for a computed field answer', async () => {
    const { user, patient, riskArea } = await setup(txn);
    const concern = await Concern.create({ title: 'Concern' }, txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      { title: 'GoalTemplate' },
      txn,
    );
    const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
      {
        title: 'GoalTemplate2',
      },
      txn,
    );
    const computedField = await ComputedField.create(
      {
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'string' as ComputedFieldDataTypes,
      },
      txn,
    );
    const question = await Question.create(
      {
        title: 'Question',
        answerType: 'radio' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        computedFieldId: computedField.id,
      },
      txn,
    );
    const answer = await Answer.create(
      {
        questionId: question.id,
        displayValue: 'Answer',
        value: 'answer',
        valueType: 'string' as AnswerValueTypeOptions,
        order: 1,
        inSummary: false,
      },
      txn,
    );
    await ConcernSuggestion.create(
      {
        concernId: concern.id,
        answerId: answer.id,
      },
      txn,
    );
    await GoalSuggestion.create(
      {
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      },
      txn,
    );
    await GoalSuggestion.create(
      {
        goalSuggestionTemplateId: goalSuggestionTemplate2.id,
        answerId: answer.id,
      },
      txn,
    );
    // So that we can check that existing PatientGoals are filtered out
    await PatientGoal.create(
      {
        patientId: patient.id,
        userId: user.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        patientConcernId: patientConcern.id,
      },
      txn,
    );
    const patientAnswers = await PatientAnswer.create(
      {
        patientId: patient.id,
        questionIds: [question.id],
        mixerJobId: 'mixerJobId',
        answers: [
          {
            answerId: answer.id,
            questionId: question.id,
            answerValue: answer.value,
            patientId: patient.id,
            applicable: true,
            mixerJobId: 'mixerJobId',
          },
        ],
        type: 'computedFieldAnswer',
      },
      txn,
    );

    const beforeCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
    expect(beforeCarePlanSuggestions.length).toEqual(0);

    await createSuggestionsForComputedFieldAnswer(
      patient.id,
      patientAnswers[0].id,
      computedField.id,
      txn,
    );

    const carePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
    const sortedSuggestions = carePlanSuggestions.sort((a, b) => {
      return a.suggestionType < b.suggestionType ? -1 : 1;
    });

    expect(sortedSuggestions.length).toEqual(1);
    expect(sortedSuggestions[0].goalSuggestionTemplate).toMatchObject(goalSuggestionTemplate2);
  });
});
