import * as kue from 'kue';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Clinic from '../../models/clinic';
import ComputedField from '../../models/computed-field';
import Concern from '../../models/concern';
import ConcernSuggestion from '../../models/concern-suggestion';
import GoalSuggestion from '../../models/goal-suggestion';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientGoal from '../../models/patient-goal';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import { createRiskArea } from '../../spec-helpers';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import { processNewComputedFieldValue } from '../computed-field-consumer';

const queue = kue.createQueue();

interface ISetup {
  patient: Patient;
  user: User;
  clinic: Clinic;
  riskArea: RiskArea;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'physician'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const riskArea = await createRiskArea({ title: 'testing' }, txn);

  return {
    clinic,
    user,
    patient,
    riskArea,
  };
}

describe('processing computedField jobs', () => {
  let txn = null as any;

  beforeAll(async () => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    queue.testMode.clear();

    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...

    await Db.release();
  });

  it('throws an error if data is missing', async () => {
    const { patient } = await setup(txn);
    const data = {
      patientId: patient.id,
      slug: 'computed-field-slug',
      value: 'computed-field-value',
    };

    await expect(processNewComputedFieldValue(data as any, txn)).rejects.toMatch(
      'Missing either patientId, slug, value, or jobId',
    );
  });

  it('throws an error if a patient cannot be found', async () => {
    const patientId = uuid();
    const data = {
      patientId,
      slug: 'slug',
      value: 'value',
      jobId: 'jobId',
    };
    await expect(processNewComputedFieldValue(data, txn)).rejects.toMatch(
      `Cannot find patient for id: ${patientId}`,
    );
  });

  it('throws an error if an answer cannot be found for the provided data', async () => {
    const { riskArea, patient } = await setup(txn);
    const computedField = await ComputedField.create(
      {
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'string',
      },
      txn,
    );
    const question = await Question.create(
      {
        title: 'Question',
        answerType: 'radio',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        computedFieldId: computedField.id,
      },
      txn,
    );
    await Answer.create(
      {
        questionId: question.id,
        displayValue: 'Answer',
        value: 'answer',
        valueType: 'string',
        order: 1,
        inSummary: false,
      },
      txn,
    );
    const data = {
      patientId: patient.id,
      slug: computedField.slug,
      value: 'fake-value',
      jobId: 'jobId',
    };
    await expect(processNewComputedFieldValue(data, txn)).rejects.toMatch(
      `Cannot find answer for slug: ${computedField.slug} and value: fake-value`,
    );
  });

  it('records care plan suggestions', async () => {
    const { riskArea, patient, user } = await setup(txn);
    const concern = await Concern.create({ title: 'Concern' }, txn);
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      {
        title: 'GoalTemplate',
      },
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
        dataType: 'string',
      },
      txn,
    );
    const question = await Question.create(
      {
        title: 'Question',
        answerType: 'radio',
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
        valueType: 'string',
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
      },
      txn,
    );
    const data = {
      patientId: patient.id,
      slug: computedField.slug,
      value: answer.value,
      jobId: 'jobId',
    };

    const beforeCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
    expect(beforeCarePlanSuggestions.length).toEqual(0);

    await processNewComputedFieldValue(data, txn);

    const carePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
    const sortedSuggestions = carePlanSuggestions.sort((a, b) => {
      return a.suggestionType < b.suggestionType ? -1 : 1;
    });
    expect(sortedSuggestions.length).toEqual(2);
    expect(sortedSuggestions[0].concern!.id).toEqual(concern.id);
    expect(sortedSuggestions[1].goalSuggestionTemplate).toMatchObject(goalSuggestionTemplate2);
  });
});
