import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  cleanPatientAnswerEvents,
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Answer from '../answer';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientAnswer from '../patient-answer';
import PatientAnswerEvent from '../patient-answer-event';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import Question from '../question';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import User from '../user';

const userRole = 'physician';

describe('answer model', () => {
  let db: Db;
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
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
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get an answer', async () => {
    const patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
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
    });
    expect(patientAnswers[0].answerValue).toEqual('3');
    expect(await PatientAnswer.get(patientAnswers[0].id)).toEqual(patientAnswers[0]);
    expect(await PatientAnswer.getForQuestion(question.id, patient.id)).toMatchObject([
      patientAnswers[0],
    ]);
  });

  it('should create and get an answer for progress note', async () => {
    const progressNoteTemplate = await ProgressNoteTemplate.create({
      title: 'title',
    });
    const progressNote = await ProgressNote.create({
      patientId: patient.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    });
    const progressNoteTemplateQuestion = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      progressNoteTemplateId: progressNoteTemplate.id,
      type: 'progressNoteTemplate',
      order: 1,
    });
    const progressNoteTemplateAnswer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: progressNoteTemplateQuestion.id,
      order: 1,
    });
    const patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
      progressNoteId: progressNote.id,
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
    });
    expect(patientAnswers[0].answerValue).toEqual('3');
    expect(await PatientAnswer.get(patientAnswers[0].id)).toEqual(patientAnswers[0]);
    expect(
      await PatientAnswer.getForQuestion(progressNoteTemplateQuestion.id, patient.id),
    ).toMatchObject([patientAnswers[0]]);
  });

  it(
    "should error when creating a patient answer with a progress note where the progress note's" +
      " progress note template is not the same as the answers's questions's progress note template",
    async () => {
      const progressNoteTemplate = await ProgressNoteTemplate.create({
        title: 'title',
      });
      const progressNote = await ProgressNote.create({
        patientId: patient.id,
        userId: user.id,
        progressNoteTemplateId: progressNoteTemplate.id,
      });

      let errorMessage = '';
      try {
        await PatientAnswer.create({
          patientId: patient.id,
          progressNoteId: progressNote.id,
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
        });
      } catch (e) {
        errorMessage = e.message;
      }

      expect(errorMessage).toEqual(
        /* tslint:disable:max-line-length */
        `progress note ${progressNote.id} is not associated with the same progress note template as the question ${question.id}`,
        /* tslint:enable:max-line-length */
      );
    },
  );

  it('should mark appropriate previous answers as deleted', async () => {
    const previousAnswers = await PatientAnswer.create({
      patientId: patient.id,
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
    });
    const fetchedAnswers1 = await PatientAnswer.getForQuestion(answer.questionId, patient.id);
    expect(fetchedAnswers1!.map(ans => ans.id)).toContain(previousAnswers[0].id);

    const differentAnswer = await Answer.create({
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 2,
    });

    const newAnswers = await PatientAnswer.create({
      patientId: patient.id,
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
    });
    const fetchedAnswers2 = await PatientAnswer.getForQuestion(answer.questionId, patient.id);
    const fetchedAnswers2Ids = fetchedAnswers2!.map(ans => ans.id);

    expect(fetchedAnswers2Ids).toContain(newAnswers[0].id);
    expect(fetchedAnswers2Ids).not.toContain(previousAnswers[0].id);

    // Correct PatientAnswerEvents should also get created
    const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(fetchedPatientAnswerEvents.total).toEqual(2);
    expect(fetchedPatientAnswerEvents.results).toMatchObject([
      {
        patientAnswerId: newAnswers[0].id,
        previousPatientAnswerId: previousAnswers[0].id,
      },
      {
        patientAnswerId: previousAnswers[0].id,
        previousPatientAnswerId: null,
      },
    ]);
  });

  it('getForQuestion returns most recent answer for non-multiselect question', async () => {
    await PatientAnswer.create({
      patientId: patient.id,
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
    });
    const patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
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
    });
    expect(patientAnswers[0].answerValue).toEqual('2');
    expect(await PatientAnswer.getForQuestion(question.id, patient.id)).toEqual([
      patientAnswers[0],
    ]);
  });

  it('should create and get an answer for multiselect', async () => {
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'multiselect',
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
    const patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
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
    });
    const patientAnswers2 = await PatientAnswer.create({
      patientId: patient.id,
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
    });
    expect(patientAnswers[0].answerValue).toEqual('3');

    await expect(PatientAnswer.get(patientAnswers[0].id)).rejects.toMatch(
      `No such patientAnswer: ${patientAnswers[0].id}`,
    );
    expect(
      (await PatientAnswer.getForQuestion(question.id, patient.id))!.map(ans => ans.id),
    ).toEqual([patientAnswers2[0].id]); // Only checking for answer2, since it will replace answer1
  });

  it('should throw an error if an answer does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(PatientAnswer.get(fakeId)).rejects.toMatch(`No such patientAnswer: ${fakeId}`);
  });

  it('gets all patient answers for a given patient', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    });

    const fetchedAnswers = await PatientAnswer.getAllForPatient(patient.id);

    expect(fetchedAnswers[0].id).toEqual(patientAnswers[0].id);
  });

  it('can get answer history', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    });
    expect(patientAnswers[0].answerValue).toEqual('3');
    const patientAnswers2 = await PatientAnswer.create({
      patientId: patient.id,
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
    expect(patientAnswers2[0].answerValue).toEqual('2');

    // should not include answers for another patient
    const otherPatient = await createPatient(createMockPatient(321, clinic.id), user.id);
    await PatientAnswer.create({
      patientId: otherPatient.id,
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
    });

    expect(
      (await PatientAnswer.getPreviousAnswersForQuestion(question.id, patient.id))[0],
    ).toMatchObject({
      answerId: patientAnswers[0].answerId,
      answerValue: '3',
      patientId: patient.id,
    });
  });

  it('edits patient answer applicable', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    });
    const patientAnswerUpdated = await PatientAnswer.editApplicable(false, patientAnswers[0].id);
    expect(patientAnswerUpdated.applicable).toBeFalsy();
  });

  it('deletes patient answer', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    });
    const deletedPatientAnswer = await PatientAnswer.delete(patientAnswers[0].id);
    expect(deletedPatientAnswer).not.toBeNull();
  });

  it('gets all for risk area', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    });
    expect(await PatientAnswer.getForRiskArea(riskArea.id, patient.id)).toEqual([
      patientAnswers[0],
    ]);
  });

  it('gets all for screening tool', async () => {
    const screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
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
    expect(await PatientAnswer.getForScreeningTool(screeningTool.id, patient.id)).toEqual([
      patientAnswers[0],
    ]);
  });

  it('creates patient answer events for a list of answers', async () => {
    const screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });
    const screeningToolQuestion1 = await Question.create({
      title: 'like writing tests again?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      order: 1,
      type: 'screeningTool',
    });
    const screeningToolQuestion2 = await Question.create({
      title: 'hate writing tests?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      order: 2,
      type: 'screeningTool',
    });
    const screeningToolAnswer1 = await Answer.create({
      displayValue: 'hates writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: screeningToolQuestion1.id,
      order: 1,
    });
    const screeningToolAnswer2 = await Answer.create({
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: screeningToolQuestion2.id,
      order: 1,
    });
    const oldPatientAnswers = await PatientAnswer.create({
      patientId: patient.id,
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
    });
    const newPatientAnswers = await PatientAnswer.create({
      patientId: patient.id,
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
    });

    await cleanPatientAnswerEvents(patient.id);

    await transaction(
      PatientAnswer.knex(),
      async txn =>
        await PatientAnswer.createPatientAnswerEvents(newPatientAnswers, oldPatientAnswers, txn),
    );

    const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedPatientAnswerEvents.total).toEqual(2);
    const newAnswer = fetchedPatientAnswerEvents.results
      .find(r => r.patientAnswerId === newPatientAnswers[0].id);
    const newAnswer2 = fetchedPatientAnswerEvents.results
      .find(r => r.patientAnswerId === newPatientAnswers[1].id);

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
