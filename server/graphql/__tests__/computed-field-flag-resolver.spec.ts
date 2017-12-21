import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import ComputedFieldFlag from '../../models/computed-field-flag';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question, { IRiskAreaQuestion } from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import User from '../../models/user';
import {
  createMockAnswer,
  createMockClinic,
  createMockPatient,
  createMockQuestion,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
const reason = 'Viscerion destroyed the Wall';

describe('computed field flag resolver', () => {
  let db: Db;
  let user: User;
  let clinic: Clinic;
  let patient: Patient;
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let patientAnswers: PatientAnswer[];
  let riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(12, clinic.id), user.id);
    riskArea = await createRiskArea({ title: 'The War for the Dawn' });
    question = await Question.create(createMockQuestion(riskArea.id) as IRiskAreaQuestion);
    answer = await Answer.create(createMockAnswer(question.id));
    riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });

    patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
      questionIds: [question.id],
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
      answers: [
        {
          questionId: question.id,
          answerId: answer.id,
          answerValue: '3',
          patientId: patient.id,
          userId: user.id,
          applicable: true,
        },
      ],
      type: 'riskAreaAssessmentSubmission',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates a computed field flag', async () => {
    await transaction(ComputedFieldFlag.knex(), async txn => {
      const mutation = `mutation {
        computedFieldFlagCreate(input: {
          patientAnswerId: "${patientAnswers[0].id}",
          reason: "${reason}"
        }) {
          id
          patientAnswerId
          userId
          reason
        }
      }`;

      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id, txn });
      const computedFieldFlag = cloneDeep(result.data!.computedFieldFlagCreate);

      expect(computedFieldFlag.id).toBeTruthy();
      expect(computedFieldFlag).toMatchObject({
        userId: user.id,
        patientAnswerId: patientAnswers[0].id,
        reason,
      });
    });
  });
});
