import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import CarePlanUpdateEvent from '../../models/care-plan-update-event';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientAnswerEvent from '../../models/patient-answer-event';
import PatientConcern from '../../models/patient-concern';
import ProgressNote from '../../models/progress-note';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import {
  cleanCarePlanUpdateEvents,
  cleanPatientAnswerEvents,
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('progress note resolver', () => {
  const userRole = 'admin';
  let user: User;
  let patient: Patient;
  let riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    const clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const riskArea = await RiskArea.create({ title: 'Risk Area', order: 1 });
    riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets activity for a progress note', async () => {
    // Lots and lots of setup :-(
    const progressNote = await ProgressNote.autoOpenIfRequired({
      patientId: patient.id,
      userId: user.id,
    });
    const task = await Task.create({
      title: 'Task Title',
      description: 'Task description',
      dueAt: new Date().toISOString(),
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
      progressNoteId: progressNote.id,
    });
    const concern = await Concern.create({ title: 'Concern Title' });
    const patientConcern = await PatientConcern.create({
      patientId: patient.id,
      concernId: concern.id,
      userId: user.id,
    });
    await cleanCarePlanUpdateEvents(patient.id);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
      eventType: 'create_patient_concern',
      progressNoteId: progressNote.id,
    });
    const riskArea = await RiskArea.create({ title: 'Risk Area Title', order: 1 });
    const question = await Question.create({
      riskAreaId: riskArea.id,
      title: 'Question Title',
      answerType: 'dropdown',
      type: 'riskArea',
      order: 1,
    });
    const answer = await Answer.create({
      questionId: question.id,
      displayValue: '1',
      value: '1',
      valueType: 'number',
      order: 1,
    });
    const patientAnswer = (await PatientAnswer.create({
      patientId: patient.id,
      type: 'riskAreaAssessmentSubmission',
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
      questionIds: [answer.questionId],
      answers: [
        {
          answerId: answer.id,
          questionId: question.id,
          answerValue: answer.value,
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        },
      ],
    }))[0];
    await cleanPatientAnswerEvents(patient.id);
    const patientAnswerEvent = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
      progressNoteId: progressNote.id,
    });
    // Phew, setup done

    const query = `{
      progressNoteActivityForProgressNote(
        progressNoteId: "${progressNote.id}",
      ) {
        taskEvents { id }
        patientAnswerEvents { id }
        carePlanUpdateEvents { id }
      }
    }`;
    const result = await graphql(schema, query, null, { userRole, userId: user.id });
    const clonedResults = cloneDeep(result.data!.progressNoteActivityForProgressNote);
    expect(clonedResults.taskEvents.length).toEqual(1);
    expect(clonedResults.patientAnswerEvents.length).toEqual(1);
    expect(clonedResults.carePlanUpdateEvents.length).toEqual(1);
    expect(clonedResults.taskEvents[0].id).toEqual(taskEvent.id);
    expect(clonedResults.patientAnswerEvents[0].id).toEqual(patientAnswerEvent.id);
    expect(clonedResults.carePlanUpdateEvents[0].id).toEqual(carePlanUpdateEvent.id);
  });
});
