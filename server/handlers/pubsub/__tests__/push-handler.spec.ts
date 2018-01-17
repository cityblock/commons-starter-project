import * as httpMocks from 'node-mocks-http';
import { transaction, Transaction } from 'objection';
import Db from '../../../db';
import Answer from '../../../models/answer';
import CarePlanSuggestion from '../../../models/care-plan-suggestion';
import Clinic from '../../../models/clinic';
import ComputedField from '../../../models/computed-field';
import Concern from '../../../models/concern';
import ConcernSuggestion from '../../../models/concern-suggestion';
import GoalSuggestion from '../../../models/goal-suggestion';
import GoalSuggestionTemplate from '../../../models/goal-suggestion-template';
import Patient from '../../../models/patient';
import PatientGoal from '../../../models/patient-goal';
import Question from '../../../models/question';
import RiskArea from '../../../models/risk-area';
import User from '../../../models/user';
import { createRiskArea } from '../../../spec-helpers';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../../spec-helpers';
import { pubsubPushHandler } from '../push-handler';
import { createHmac } from '../validator';

interface ISetup {
  patient: Patient;
  user: User;
  clinic: Clinic;
  riskArea: RiskArea;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'physician'), txn);
  const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);
  const riskArea = await createRiskArea({ title: 'testing' }, txn);

  return {
    clinic,
    user,
    patient,
    riskArea,
  };
}

describe('handling pubusub push events from mixer', () => {
  const originalConsoleError = console.error;
  const response = httpMocks.createResponse();

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    response.sendStatus = jest.fn();
    response.locals = {}; // response.locals is something Express provides
    console.error = jest.fn();
  });

  afterAll(async () => {
    await Db.release();
    console.error = originalConsoleError;
  });

  it('ends the request if data is missing from the request', async () => {
    await transaction(Patient.knex(), async txn => {
      response.locals.existingTxn = txn;
      const { patient } = await setup(txn);
      const badData = {
        patientId: patient.id,
        slug: 'slug',
        value: 'value',
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/pubsub/push',
        body: {
          message: {
            data: badData,
            attributes: {
              hmac: createHmac(JSON.stringify(badData)),
            },
          },
        },
      });
      await pubsubPushHandler(request, response);
      expect(console.error).toBeCalledWith('Must provide a patientId, slug, value, and jobId');
      expect(response.sendStatus).toBeCalledWith(200);
    });
  });

  it('ends the request if a patient cannot be found', async () => {
    await transaction(Patient.knex(), async txn => {
      response.locals.existingTxn = txn;
      const badData = {
        patientId: 'fake patient id',
        slug: 'slug',
        value: 'value',
        jobId: 'jobId',
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/pubsub/push',
        body: {
          message: {
            data: badData,
            attributes: {
              hmac: createHmac(JSON.stringify(badData)),
            },
          },
        },
      });
      await pubsubPushHandler(request, response);
      expect(console.error).toBeCalledWith('Cannot find patient for id: fake patient id');
      expect(response.sendStatus).toBeCalledWith(200);
    });
  });

  it('ends the request if an answer cannot be found for the provided data', async () => {
    await transaction(Patient.knex(), async txn => {
      response.locals.existingTxn = txn;
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
      const badData = {
        patientId: patient.id,
        slug: computedField.slug,
        value: 'fake',
        jobId: 'jobId',
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/pubsub/push',
        body: {
          message: {
            data: badData,
            attributes: {
              hmac: createHmac(JSON.stringify(badData)),
            },
          },
        },
      });
      await pubsubPushHandler(request, response);
      expect(console.error).toBeCalledWith(
        'Cannot find answer for slug: computed-field and value: fake',
      );
      expect(response.sendStatus).toBeCalledWith(200);
    });
  });

  it('records care plan suggestions', async () => {
    await transaction(Patient.knex(), async txn => {
      const { riskArea, patient, user } = await setup(txn);
      response.locals.existingTxn = txn;
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
      const goodData = {
        patientId: patient.id,
        slug: computedField.slug,
        value: answer.value,
        jobId: 'jobId',
      };
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/pubsub/push',
        body: {
          message: {
            data: goodData,
            attributes: {
              hmac: createHmac(JSON.stringify(goodData)),
            },
          },
        },
      });

      const beforeCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
      expect(beforeCarePlanSuggestions.length).toEqual(0);
      await pubsubPushHandler(request, response);
      expect(response.sendStatus).toBeCalledWith(200);
      expect(console.error).not.toBeCalled();
      const carePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
      const sortedSuggestions = carePlanSuggestions.sort((a, b) => {
        return a.suggestionType < b.suggestionType ? -1 : 1;
      });
      expect(sortedSuggestions.length).toEqual(2);
      expect(sortedSuggestions[0].concern!.id).toEqual(concern.id);
      expect(sortedSuggestions[1].goalSuggestionTemplate).toMatchObject(goalSuggestionTemplate2);
    });
  });
});
