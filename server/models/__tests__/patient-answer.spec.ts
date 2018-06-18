import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
import uuid from 'uuid/v4';
import {
  cleanPatientAnswerEvents,
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import Answer from '../answer';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientAnswer from '../patient-answer';
import PatientAnswerEvent from '../patient-answer-event';
import PatientScreeningToolSubmission from '../patient-screening-tool-submission';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import Question from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import ScreeningTool from '../screening-tool';
import User from '../user';

const userRole = 'physician' as UserRole;
const longAnswerValue = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec.`;

interface ISetup {
  riskArea: RiskArea;
  question: Question;
  answer: Answer;
  patient: Patient;
  user: User;
  clinic: Clinic;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    txn,
  );

  return {
    clinic,
    riskArea,
    question,
    answer,
    user,
    patient,
    riskAreaAssessmentSubmission,
  };
}

describe('answer model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('progress note answers', async () => {
    it('should create and get an answer for progress note', async () => {
      const { patient, user } = await setup(txn);
      const progressNoteTemplate = await ProgressNoteTemplate.create(
        {
          title: 'title',
        },
        txn,
      );
      const progressNote = await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      const progressNoteTemplateQuestion = await Question.create(
        {
          title: 'like writing tests?',
          answerType: 'dropdown' as AnswerTypeOptions,
          progressNoteTemplateId: progressNoteTemplate.id,
          type: 'progressNoteTemplate',
          order: 1,
        },
        txn,
      );
      const progressNoteTemplateAnswer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: progressNoteTemplateQuestion.id,
          order: 1,
        },
        txn,
      );
      const patientAnswers = await PatientAnswer.createForProgressNote(
        {
          patientId: patient.id,
          progressNoteId: progressNote.id,
          questionIds: [progressNoteTemplateAnswer.questionId],
          answers: [
            {
              questionId: progressNoteTemplateAnswer.questionId,
              answerId: progressNoteTemplateAnswer.id,
              answerValue: '3',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      expect(patientAnswers[0].answerValue).toEqual('3');
      expect(patientAnswers[0].progressNoteId).toEqual(progressNote.id);
      expect(await PatientAnswer.get(patientAnswers[0].id, txn)).toEqual(patientAnswers[0]);
      expect(
        await PatientAnswer.getForQuestion(progressNoteTemplateQuestion.id, patient.id, txn),
      ).toMatchObject([patientAnswers[0]]);
    });
  });

  describe('risk assessment answers', async () => {
    it('should create and get an answer', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user, question } = await setup(txn);
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      expect(patientAnswers[0].answerValue).toEqual('3');
      expect(await PatientAnswer.get(patientAnswers[0].id, txn)).toEqual(patientAnswers[0]);
      expect(await PatientAnswer.getForQuestion(question.id, patient.id, txn)).toMatchObject([
        patientAnswers[0],
      ]);
    });

    it('should create and get a long answer', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user, question } = await setup(txn);
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: longAnswerValue,
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      expect(patientAnswers[0].answerValue).toEqual(longAnswerValue);
      expect(await PatientAnswer.get(patientAnswers[0].id, txn)).toEqual(patientAnswers[0]);
      expect(await PatientAnswer.getForQuestion(question.id, patient.id, txn)).toMatchObject([
        patientAnswers[0],
      ]);
    });

    it('should mark appropriate previous answers as deleted', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user, question } = await setup(txn);
      const previousAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      const fetchedAnswers1 = await PatientAnswer.getForQuestion(
        answer.questionId,
        patient.id,
        txn,
      );
      expect(fetchedAnswers1.map(ans => ans.id)).toContain(previousAnswers[0].id);

      const differentAnswer = await Answer.create(
        {
          displayValue: 'hates writing tests!',
          value: '4',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: question.id,
          order: 2,
        },
        txn,
      );

      const newAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: differentAnswer.id,
              answerValue: '4',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      const fetchedAnswers2 = await PatientAnswer.getForQuestion(
        answer.questionId,
        patient.id,
        txn,
      );
      const fetchedAnswers2Ids = fetchedAnswers2.map(ans => ans.id);

      expect(fetchedAnswers2Ids).toContain(newAnswers[0].id);
      expect(fetchedAnswers2Ids).not.toContain(previousAnswers[0].id);

      // Correct PatientAnswerEvents should also get created
      const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(
        patient.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(fetchedPatientAnswerEvents.total).toEqual(2);
      const mappedPatientAnswerEvents = fetchedPatientAnswerEvents.results.map(event => ({
        patientAnswerId: event.patientAnswerId,
        previousPatientAnswerId: event.previousPatientAnswerId,
      }));
      expect(
        mappedPatientAnswerEvents.some(
          event =>
            event.patientAnswerId === newAnswers[0].id &&
            event.previousPatientAnswerId === previousAnswers[0].id,
        ),
      ).toEqual(true);
      expect(
        mappedPatientAnswerEvents.some(
          event =>
            event.patientAnswerId === previousAnswers[0].id &&
            event.previousPatientAnswerId === null,
        ),
      ).toEqual(true);
    });

    it('getForQuestion returns most recent answer for non-multiselect question', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user, question } = await setup(txn);
      await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '2',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      expect(patientAnswers[0].answerValue).toEqual('2');
      expect(await PatientAnswer.getForQuestion(question.id, patient.id, txn)).toEqual([
        patientAnswers[0],
      ]);
    });

    it('should create and get an answer for multiselect', async () => {
      const { riskArea, riskAreaAssessmentSubmission, user, patient } = await setup(txn);

      const question = await Question.create(
        {
          title: 'like writing tests?',
          answerType: 'multiselect' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const answer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: question.id,
          order: 1,
        },
        txn,
      );
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      const patientAnswers2 = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '2',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      expect(patientAnswers[0].answerValue).toEqual('3');

      await expect(PatientAnswer.get(patientAnswers[0].id, txn)).rejects.toMatch(
        `No such patientAnswer: ${patientAnswers[0].id}`,
      );
      expect(
        (await PatientAnswer.getForQuestion(question.id, patient.id, txn)).map(ans => ans.id),
      ).toEqual([patientAnswers2[0].id]);

      // Only checking for answer2, since it will replace answer1
    });

    it('should throw an error if an answer does not exist for the id', async () => {
      const fakeId = uuid();
      await expect(PatientAnswer.get(fakeId, txn)).rejects.toMatch(
        `No such patientAnswer: ${fakeId}`,
      );
    });

    it('gets all patient answers for a given patient', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user } = await setup(txn);
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
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
        },
        txn,
      );

      const fetchedAnswers = await PatientAnswer.getAllForPatient(patient.id, txn);

      expect(fetchedAnswers[0].id).toEqual(patientAnswers[0].id);
    });

    it('can get answer history', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user, clinic, question } = await setup(
        txn,
      );
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
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
        },
        txn,
      );
      expect(patientAnswers[0].answerValue).toEqual('3');
      const patientAnswers2 = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
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
        },
        txn,
      );
      expect(patientAnswers2[0].answerValue).toEqual('2');

      // should not include answers for another patient
      const otherPatient = await createPatient({ cityblockId: 234, homeClinicId: clinic.id }, txn);
      await PatientAnswer.createForRiskArea(
        {
          patientId: otherPatient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '2',
              patientId: otherPatient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      expect(
        (await PatientAnswer.getPreviousAnswersForQuestion(question.id, patient.id, txn))[0],
      ).toMatchObject({
        answerId: patientAnswers[0].answerId,
        answerValue: '3',
        patientId: patient.id,
      });
    });

    it('edits patient answer applicable', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user } = await setup(txn);
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
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
        },
        txn,
      );
      const patientAnswerUpdated = await PatientAnswer.editApplicable(
        false,
        patientAnswers[0].id,
        txn,
      );
      expect(patientAnswerUpdated.applicable).toBeFalsy();
    });

    it('deletes patient answer', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user } = await setup(txn);
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
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
        },
        txn,
      );
      const deletedPatientAnswer = await PatientAnswer.delete(patientAnswers[0].id, txn);
      expect(deletedPatientAnswer).not.toBeFalsy();
    });

    it('gets all for risk area', async () => {
      const { riskAreaAssessmentSubmission, answer, patient, user, riskArea } = await setup(txn);
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          patientId: patient.id,
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
        },
        txn,
      );
      expect(await PatientAnswer.getForRiskArea(riskArea.id, patient.id, txn)).toEqual([
        patientAnswers[0],
      ]);
    });
  });
  describe('screening tool answers', async () => {
    it('gets all for screening tool submission', async () => {
      const { riskArea, patient, user } = await setup(txn);
      const screeningTool = await ScreeningTool.create(
        {
          title: 'Screening Tool',
          riskAreaId: riskArea.id,
        },
        txn,
      );
      const screeningToolQuestion = await Question.create(
        {
          title: 'like writing tests again?',
          answerType: 'dropdown' as AnswerTypeOptions,
          screeningToolId: screeningTool.id,
          type: 'screeningTool',
          order: 1,
        },
        txn,
      );
      const screeningToolAnswer = await Answer.create(
        {
          displayValue: 'loves writing more tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: screeningToolQuestion.id,
          order: 1,
        },
        txn,
      );
      const answerParams = {
        questionId: screeningToolAnswer.questionId,
        answerId: screeningToolAnswer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
        userId: user.id,
      };
      const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create(
        {
          screeningToolId: screeningTool.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );
      const patientAnswers = await PatientAnswer.createForScreeningTool(
        {
          patientId: patient.id,
          answers: [answerParams],
          questionIds: [screeningToolAnswer.questionId],
          patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
        },
        txn,
      );
      expect(patientAnswers[0].patientScreeningToolSubmissionId).toEqual(
        patientScreeningToolSubmission.id,
      );
      expect(
        await PatientAnswer.getForScreeningToolSubmission(patientScreeningToolSubmission.id, txn),
      ).toEqual([patientAnswers[0]]);
    });

    it('creates patient answer events for a list of answers', async () => {
      const { riskArea, patient, user } = await setup(txn);
      const screeningTool = await ScreeningTool.create(
        {
          title: 'Screening Tool',
          riskAreaId: riskArea.id,
        },
        txn,
      );
      const screeningToolQuestion1 = await Question.create(
        {
          title: 'like writing tests again?',
          answerType: 'dropdown' as AnswerTypeOptions,
          screeningToolId: screeningTool.id,
          order: 1,
          type: 'screeningTool',
        },
        txn,
      );
      const screeningToolQuestion2 = await Question.create(
        {
          title: 'hate writing tests?',
          answerType: 'dropdown' as AnswerTypeOptions,
          screeningToolId: screeningTool.id,
          order: 2,
          type: 'screeningTool',
        },
        txn,
      );
      const screeningToolAnswer1 = await Answer.create(
        {
          displayValue: 'hates writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: screeningToolQuestion1.id,
          order: 1,
        },
        txn,
      );
      const screeningToolAnswer2 = await Answer.create(
        {
          displayValue: 'hates writing tests!',
          value: '4',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: screeningToolQuestion2.id,
          order: 1,
        },
        txn,
      );
      const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create(
        {
          screeningToolId: screeningTool.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );
      const oldPatientAnswers = await PatientAnswer.createForScreeningTool(
        {
          patientId: patient.id,
          patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
          questionIds: [screeningToolAnswer1.questionId, screeningToolAnswer2.questionId],
          answers: [
            {
              questionId: screeningToolAnswer1.questionId,
              answerId: screeningToolAnswer1.id,
              answerValue: screeningToolAnswer1.value,
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
            {
              questionId: screeningToolAnswer2.questionId,
              answerId: screeningToolAnswer2.id,
              answerValue: screeningToolAnswer2.value,
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );
      const newPatientAnswers = await PatientAnswer.createForScreeningTool(
        {
          patientId: patient.id,
          patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
          questionIds: [screeningToolAnswer1.questionId, screeningToolAnswer2.questionId],
          answers: [
            {
              questionId: screeningToolAnswer1.questionId,
              answerId: screeningToolAnswer1.id,
              answerValue: screeningToolAnswer1.value,
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
            {
              questionId: screeningToolAnswer2.questionId,
              answerId: screeningToolAnswer2.id,
              answerValue: screeningToolAnswer2.value,
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      await cleanPatientAnswerEvents(patient.id, txn);

      await PatientAnswer.createPatientAnswerEvents(newPatientAnswers, oldPatientAnswers, txn);

      const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(
        patient.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );

      expect(fetchedPatientAnswerEvents.total).toEqual(2);
      const newAnswer = fetchedPatientAnswerEvents.results.find(
        r => r.patientAnswerId === newPatientAnswers[0].id,
      );
      const newAnswer2 = fetchedPatientAnswerEvents.results.find(
        r => r.patientAnswerId === newPatientAnswers[1].id,
      );

      expect(newAnswer).toMatchObject({
        patientAnswerId: newPatientAnswers[0].id,
        previousPatientAnswerId: oldPatientAnswers[0].id,
      });
      expect(newAnswer2).toMatchObject({
        patientAnswerId: newPatientAnswers[1].id,
        previousPatientAnswerId: oldPatientAnswers[1].id,
      });
    });
  });

  describe('getPatientIdForResource', () => {
    it('gets patient id for a given patient answer', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user } = await setup(txn);
      const patientAnswers = await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              userId: user.id,
              applicable: true,
            },
          ],
        },
        txn,
      );
      const fetchedPatientId = await PatientAnswer.getPatientIdForResource(
        patientAnswers[0].id,
        txn,
      );

      expect(fetchedPatientId).toBe(patient.id);
    });
  });
});
