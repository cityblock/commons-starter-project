import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import ConcernSuggestion from '../../models/concern-suggestion';
import GoalSuggestion from '../../models/goal-suggestion';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientScreeningToolSubmission from '../../models/patient-screening-tool-submission';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import ScreeningTool from '../../models/screening-tool';
import ScreeningToolScoreRange from '../../models/screening-tool-score-range';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient answer tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let answer2: Answer;
  let user: User;
  let patient: Patient;
  let clinic: Clinic;
  let riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));

    riskArea = await createRiskArea();
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    });
    answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    answer2 = await Answer.create({
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 2,
    });
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient answer', () => {
    it('can fetch patient answer', async () => {
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [answer.questionId],
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });
      const query = `{
        patientAnswer(patientAnswerId: "${patientAnswers[0].id}") {
          id
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientAnswer)).toMatchObject({
        id: patientAnswers[0].id,
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
      });
    });

    it('errors if a patient answer cannot be found', async () => {
      const fakeId = uuid();
      const query = `{ patientAnswer(patientAnswerId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(`No such patientAnswer: ${fakeId}`);
    });
  });

  describe('resolve patient answer for question', () => {
    it('resolves patient answer for question', async () => {
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [answer.questionId],
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });
      const query = `{
        patientAnswers(
          filterType: question, filterId: "${question.id}", patientId: "${patient.id}"
        ) {
          id, answerValue
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientAnswers)).toMatchObject([
        {
          id: patientAnswers[0].id,
          answerValue: patientAnswers[0].answerValue,
        },
      ]);
    });
  });

  describe('resolve previous patient answer for question', () => {
    it('resolves patient answer for question', async () => {
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [answer.questionId],
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });

      await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [answer.questionId],
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '2',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });
      const query = `{
        patientPreviousAnswersForQuestion(
          questionId: "${question.id}", patientId: "${patient.id}"
        ) {
          id, answerValue
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });

      expect(cloneDeep(result.data!.patientPreviousAnswersForQuestion)).toMatchObject([
        {
          id: patientAnswers[0].id,
          answerValue: '3',
        },
      ]);
    });
  });

  describe('resolve patient answers for risk area', () => {
    it('resolves patient answers for a risk area', async () => {
      const riskArea2 = await createRiskArea('testing2', 2);
      const differentQuestion = await Question.create({
        title: 'like writing tests again?',
        answerType: 'dropdown',
        riskAreaId: riskArea2.id,
        type: 'riskArea',
        order: 1,
      });
      const differentAnswer = await Answer.create({
        displayValue: 'loves writing more tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: differentQuestion.id,
        order: 1,
      });
      const patientAnswers1 = await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [answer.questionId],
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });
      const patientAnswers2 = await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [differentAnswer.questionId],
        answers: [
          {
            questionId: differentAnswer.questionId,
            answerId: differentAnswer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });

      const query = `{
        patientAnswers(
          filterType: riskArea, filterId: "${riskArea.id}", patientId: "${patient.id}"
        ) {
          id
          answerValue
          question {
            id
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const answers = cloneDeep(result.data!.patientAnswers);

      expect(answers).toMatchObject([
        {
          id: patientAnswers1[0].id,
          answerValue: '3',
          question: {
            id: question.id,
          },
        },
      ]);
      expect(answers.map((ans: any) => ans.id)).not.toContain(patientAnswers2[0].id);
    });
  });

  describe('resolve patient answers for screening tool', () => {
    it('resolves patient answers for a screening tool', async () => {
      const screeningTool = await ScreeningTool.create({
        title: 'Screening Tool',
        riskAreaId: riskArea.id,
      });
      const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool.id,
      });
      const screeningToolQuestion = await Question.create({
        title: 'like writing tests again?',
        answerType: 'dropdown',
        screeningToolId: screeningTool.id,
        type: 'screeningTool',
        order: 1,
      });
      const screeningToolAnswer = await Answer.create({
        displayValue: 'loves writing more tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: screeningToolQuestion.id,
        order: 1,
      });
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        type: 'patientScreeningToolSubmission',
        patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
        questionIds: [screeningToolAnswer.questionId],
        answers: [
          {
            questionId: screeningToolAnswer.questionId,
            answerId: screeningToolAnswer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });

      const query = `{
        patientAnswers(
          filterType: screeningTool, filterId: "${screeningTool.id}", patientId: "${patient.id}"
        ) {
          id
          answerValue
          question {
            id
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const answers = cloneDeep(result.data!.patientAnswers);

      expect(answers).toMatchObject([
        {
          id: patientAnswers[0].id,
          answerValue: '3',
          question: {
            id: screeningToolQuestion.id,
          },
        },
      ]);
    });
  });

  describe('answer edit', () => {
    it('edits answer', async () => {
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [answer.questionId],
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });
      const query = `mutation {
        patientAnswerEdit(input: {
          applicable: false,
          patientAnswerId: "${patientAnswers[0].id}",
        }) {
          applicable
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientAnswerEdit)).toMatchObject({
        applicable: false,
      });
    });
  });

  describe('patient answers create', () => {
    it('creates a new patient answer', async () => {
      const mutation = `mutation {
        patientAnswersCreate(input: {
          patientId: "${patient.id}",
          questionIds: ["${answer.questionId}"],
          riskAreaAssessmentSubmissionId: "${riskAreaAssessmentSubmission.id}",
          patientAnswers: [{
            questionId: "${answer.questionId}"
            answerValue: "loves writing tests too!"
            answerId: "${answer.id}",
            patientId: "${patient.id}",
            applicable: false,
          }]
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientAnswersCreate[0])).toMatchObject({
        answerValue: 'loves writing tests too!',
        answerId: answer.id,
        patientId: patient.id,
        applicable: false,
      });
    });

    it('creates multiple new patient answers', async () => {
      const mutation = `mutation {
        patientAnswersCreate(input: {
          patientId: "${patient.id}",
          questionIds: ["${answer.questionId}", "${answer2.questionId}"],
          riskAreaAssessmentSubmissionId: "${riskAreaAssessmentSubmission.id}",
          patientAnswers: [{
            questionId: "${answer.questionId}"
            answerValue: "loves writing tests too!"
            answerId: "${answer.id}",
            patientId: "${patient.id}",
            applicable: false,
          }, {
            questionId: "${answer2.questionId}"
            answerValue: "hates writing tests too!"
            answerId: "${answer2.id}",
            patientId: "${patient.id}",
            applicable: false,
          }]
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      const clonedResult = cloneDeep(result.data!.patientAnswersCreate);

      const patientAnswer = clonedResult.find(
        (r: any) => r.answerValue === 'loves writing tests too!',
      );
      const patientAnswer2 = clonedResult.find(
        (r: any) => r.answerValue === 'hates writing tests too!',
      );

      expect(patientAnswer).toMatchObject({
        answerValue: 'loves writing tests too!',
        answerId: answer.id,
        patientId: patient.id,
        applicable: false,
      });
      expect(patientAnswer2).toMatchObject({
        answerValue: 'hates writing tests too!',
        answerId: answer2.id,
        patientId: patient.id,
        applicable: false,
      });
    });

    it('properly marks previous answers as deleted when only questionIds are given', async () => {
      const createdAnswers = await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [answer.questionId],
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '1',
            userId: user.id,
            patientId: patient.id,
            applicable: true,
          },
        ],
      });
      const fetchedAnswers1 = await PatientAnswer.getForQuestion(answer.questionId, patient.id);
      expect(fetchedAnswers1!.map(ans => ans.id)).toContain(createdAnswers[0].id);

      // Running this mutation should mark previous answer as deleted
      const mutation = `mutation {
        patientAnswersCreate(input: {
          patientId: "${patient.id}",
          questionIds: ["${answer.questionId}"],
          riskAreaAssessmentSubmissionId: "${riskAreaAssessmentSubmission.id}",
          patientAnswers: []
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole, userId: user.id });

      const fetchedAnswers2 = await PatientAnswer.getForQuestion(answer.questionId, patient.id);
      expect(fetchedAnswers2!.map(ans => ans.id)).not.toContain(createdAnswers[0].id);
    });

    it('correctly records a screening tool submission when necessary', async () => {
      const screeningTool = await ScreeningTool.create({
        title: 'Screening Tool',
        riskAreaId: riskArea.id,
      });
      const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool.id,
      });

      const mutation = `mutation {
        patientAnswersCreate(input: {
          patientId: "${patient.id}",
          questionIds: ["${answer.questionId}", "${answer2.questionId}"],
          patientScreeningToolSubmissionId: "${patientScreeningToolSubmission.id}",
          patientAnswers: [{
            questionId: "${answer.questionId}"
            answerValue: "3"
            answerId: "${answer.id}",
            patientId: "${patient.id}",
            applicable: false,
          }, {
            questionId: "${answer2.questionId}"
            answerValue: "4"
            answerId: "${answer2.id}",
            patientId: "${patient.id}",
            applicable: false,
          }]
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      const clonedResult = cloneDeep(result.data!.patientAnswersCreate);
      const patientAnswer = clonedResult.find((r: any) => r.answerValue === '3');
      const patientAnswer2 = clonedResult.find((r: any) => r.answerValue === '4');

      expect(patientAnswer).toMatchObject({
        answerValue: '3',
        answerId: answer.id,
        patientId: patient.id,
        applicable: false,
      });

      expect(patientAnswer2).toMatchObject({
        answerValue: '4',
        answerId: answer2.id,
        patientId: patient.id,
        applicable: false,
      });

      const updatedPatientScreeningToolSubmission = await PatientScreeningToolSubmission.get(
        patientScreeningToolSubmission.id,
      );

      expect(updatedPatientScreeningToolSubmission.screeningToolId).toEqual(screeningTool.id);
      // Has not been scored yet
      expect(updatedPatientScreeningToolSubmission.score).toBeFalsy();
    });

    it('generates the correct care plan suggestions for a submitted screening tool', async () => {
      const concern = await Concern.create({ title: 'Concern' });
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({
        title: 'Goal',
      });
      await TaskTemplate.create({
        title: 'Task',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        repeating: false,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const screeningTool = await ScreeningTool.create({
        title: 'Screening Tool',
        riskAreaId: riskArea.id,
      });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Score Range',
        minimumScore: 0,
        maximumScore: 10,
        screeningToolId: screeningTool.id,
      });
      const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool.id,
      });
      await ConcernSuggestion.create({
        concernId: concern.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });

      const mutation = `mutation {
        patientAnswersCreate(input: {
          patientId: "${patient.id}",
          questionIds: ["${answer.questionId}", "${answer2.questionId}"],
          patientScreeningToolSubmissionId: "${patientScreeningToolSubmission.id}",
          patientAnswers: [{
            questionId: "${answer.questionId}"
            answerValue: "3"
            answerId: "${answer.id}",
            patientId: "${patient.id}",
            applicable: false,
          }, {
            questionId: "${answer2.questionId}"
            answerValue: "4"
            answerId: "${answer2.id}",
            patientId: "${patient.id}",
            applicable: false,
          }]
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;

      await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });

      // submit score
      const submission = await PatientScreeningToolSubmission.submitScore(
        patientScreeningToolSubmission.id,
        {
          patientAnswers: await PatientAnswer.getForScreeningToolSubmission(
            patientScreeningToolSubmission.id,
          ),
        },
      );
      expect(submission.score).toEqual(7);

      const carePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);
      expect(carePlanSuggestions.length).toEqual(2);

      const concernSuggestion = carePlanSuggestions.find(s => s.suggestionType === 'concern');
      const goalSuggestion = carePlanSuggestions.find(s => s.suggestionType === 'goal');

      expect(concernSuggestion!.concern!.id).toEqual(concern.id);
      expect(goalSuggestion!.goalSuggestionTemplate!.id).toEqual(goalSuggestionTemplate.id);
    });
  });

  describe('patient answer delete', () => {
    it('marks a patient answer as deleted', async () => {
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        questionIds: [answer.questionId],
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });
      const mutation = `mutation {
        patientAnswerDelete(input: { patientAnswerId: "${patientAnswers[0].id}" }) {
          id,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientAnswerDelete)).toMatchObject({
        id: patientAnswers[0].id,
      });
    });
  });
});
