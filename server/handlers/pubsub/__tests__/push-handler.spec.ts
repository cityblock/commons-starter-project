import * as httpMocks from 'node-mocks-http';
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

describe('handling pubusub push events from mixer', () => {
  const response = httpMocks.createResponse();
  let patient: Patient;
  let user: User;
  let clinic: Clinic;
  let riskArea: RiskArea;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, 'physician'));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    riskArea = await createRiskArea({ title: 'testing' });

    response.sendStatus = jest.fn();
    response.end = jest.fn();
    response.send = jest.fn();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('ends the request if data is missing from the request', async () => {
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
    expect(response.send).toBeCalledWith('Must provide a patientId, slug, value, and jobId');
  });

  it('ends the request if a patient cannot be found', async () => {
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
    expect(response.send).toBeCalledWith('Cannot find patient for id: fake patient id');
  });

  it('ends the request if an answer cannot be found for the provided data', async () => {
    const computedField = await ComputedField.create({
      label: 'Computed Field',
      slug: 'computed-field',
      dataType: 'string',
    });
    const question = await Question.create({
      title: 'Question',
      answerType: 'radio',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
      computedFieldId: computedField.id,
    });
    await Answer.create({
      questionId: question.id,
      displayValue: 'Answer',
      value: 'answer',
      valueType: 'string',
      order: 1,
    });
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
    expect(response.send).toBeCalledWith(
      'Cannot find answer for slug: computed-field and value: fake',
    );
  });

  it('records care plan suggestions', async () => {
    const concern = await Concern.create({ title: 'Concern' });
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'GoalTemplate' });
    const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({ title: 'GoalTemplate2' });
    const computedField = await ComputedField.create({
      label: 'Computed Field',
      slug: 'computed-field',
      dataType: 'string',
    });
    const question = await Question.create({
      title: 'Question',
      answerType: 'radio',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
      computedFieldId: computedField.id,
    });
    const answer = await Answer.create({
      questionId: question.id,
      displayValue: 'Answer',
      value: 'answer',
      valueType: 'string',
      order: 1,
    });
    await ConcernSuggestion.create({
      concernId: concern.id,
      answerId: answer.id,
    });
    await GoalSuggestion.create({
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      answerId: answer.id,
    });
    await GoalSuggestion.create({
      goalSuggestionTemplateId: goalSuggestionTemplate2.id,
      answerId: answer.id,
    });
    // So that we can check that existing PatientGoals are filtered out
    await PatientGoal.create({
      patientId: patient.id,
      userId: user.id,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
    });
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

    const beforeCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);
    expect(beforeCarePlanSuggestions.length).toEqual(0);
    await pubsubPushHandler(request, response);
    expect(response.end).toBeCalled();
    const carePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);
    expect(carePlanSuggestions.length).toEqual(2);
    expect(carePlanSuggestions[0].concern).toMatchObject(concern);
    expect(carePlanSuggestions[1].goalSuggestionTemplate).toMatchObject(goalSuggestionTemplate2);
  });
});
