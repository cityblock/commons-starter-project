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
import PatientAnswer from '../../models/patient-answer';
import PatientGoal from '../../models/patient-goal';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import { createRiskArea } from '../../spec-helpers';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import { createSuggestionsForComputedFieldAnswer } from '../suggestions';

describe('createSuggestionsForComputedFieldAnswer', () => {
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
    riskArea = await createRiskArea('testing');
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates the correct suggestions for a computed field answer', async () => {
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
    const patientAnswers = await PatientAnswer.create({
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
    });

    const beforeCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);
    expect(beforeCarePlanSuggestions.length).toEqual(0);

    await createSuggestionsForComputedFieldAnswer(
      patient.id,
      patientAnswers[0].id,
      computedField.id,
    );

    const carePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);
    expect(carePlanSuggestions.length).toEqual(2);
    expect(carePlanSuggestions[0].concern).toMatchObject(concern);
    expect(carePlanSuggestions[1].goalSuggestionTemplate).toMatchObject(goalSuggestionTemplate2);
  });
});
